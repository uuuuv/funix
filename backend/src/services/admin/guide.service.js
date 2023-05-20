const stringHandler = require("../../helpers/stringHandler");
const { v4: uuid } = require("uuid");

module.exports.getBase64ImgsFromQuillDelta = (delta) => {
  let base64Imgs = [];
  delta.ops.forEach((item) => {
    if (item.insert.image && item.insert.image.src.startsWith("data:image")) {
      base64Imgs.push({
        base64String: item.insert.image.src,
        caption: item.insert.image.caption,
      });
    }
  });

  return base64Imgs;
};

module.exports.saveBase64ImgsToDisk = async (base64Imgs, imageHandler) => {
  // base64Imgs: [ { base64String, caption } ]
  return await Promise.all(
    base64Imgs.map(({ base64String, caption }) => {
      const extension = imageHandler.getMimeTypeOfBase64String(base64String);
      const buffer = imageHandler.bufferFromBase64String(base64String);
      let fileName = "";
      fileName = caption ? stringHandler.slugify(caption) : uuid();
      fileName += "-";
      fileName += stringHandler.randomTail();
      fileName += extension;

      return imageHandler.saveBufferToDisk(buffer, fileName);
    })
  );
};

module.exports.deleteOldImgs = (newGuide, oldGuide, imageHandler) => {
  let oldImgs = [];
  const newGuideString = JSON.stringify(newGuide);

  oldGuide.content.ops.forEach((item) => {
    const imgSrc = item.insert?.image?.src;
    if (imgSrc && !newGuideString.includes(imgSrc)) {
      oldImgs.push(imgSrc);
    }
  });

  oldGuide.en.content.ops.forEach((item) => {
    const imgSrc = item.insert?.image?.src;
    if (imgSrc && !newGuideString.includes(imgSrc)) {
      oldImgs.push(imgSrc);
    }
  });

  for (let oldImg of oldImgs) {
    imageHandler.deleteByUrl(oldImg);
  }
};

module.exports.updateContentImageNames = async (
  newGuide,
  oldGuide,
  imageHandler
) => {
  const getImageItemsFromQuillDelta = (delta) => {
    return delta.ops
      .filter((item) => item.insert?.image)
      .map((item) => ({
        src: item.insert.image.src,
        caption: item.insert.image.caption,
      }));
  };
  let newGuideString = JSON.stringify(newGuide);

  const newImageItems = [...getImageItemsFromQuillDelta(newGuide.content)];

  const oldImageItems = [...getImageItemsFromQuillDelta(oldGuide.content)];

  const changedCaptionImageItems = newImageItems.filter((newItem) =>
    oldImageItems.find(
      (oldItem) =>
        oldItem.src === newItem.src && oldItem.caption !== newItem.caption
    )
  );

  const newUrls = await Promise.all(
    changedCaptionImageItems.map((item) => {
      const slug = stringHandler.slugify(item.caption);
      return imageHandler.renameImage(item.src, slug);
    })
  );

  const newAndOldUrls = newUrls.map((item, index) => ({
    newUrl: item,
    oldUrl: changedCaptionImageItems[index].src,
  }));

  newAndOldUrls.forEach((item) => {
    while (newGuideString.includes(item.oldUrl)) {
      newGuideString = newGuideString.replace(item.oldUrl, item.newUrl);
    }
  });

  return newGuideString;
};
