const stringHandler = require("../../helpers/stringHandler");
const getItineraryImgItems = (itinerary) => {
  return itinerary.reduce((acc, cur) => [...acc, ...cur.images], []);
};

module.exports.putImagesToItinerary = async (
  itinerary,
  uploadedImages,
  imageHandler
) => {
  const imgItems = uploadedImages.map((file) => {
    // originalname có dạng: imgId-joyadivider-caption.jpg
    const [imgId, captionWithExtension] =
      file.originalname.split("-joyadivider-");

    const dotIndex = captionWithExtension.lastIndexOf(".");
    const extension = captionWithExtension.slice(dotIndex);
    const captionWithOutExtension = captionWithExtension.slice(0, dotIndex);

    let uploadName = "";
    uploadName += captionWithOutExtension.trim();
    uploadName += "-";
    uploadName += stringHandler.randomTail();
    uploadName += extension;

    return {
      imgId,
      uploadName,
      buffer: file.buffer,
    };
  });

  // upload hình
  let urls = await Promise.all(
    imgItems.map((imgItem) => {
      return imageHandler.saveBufferToDisk(imgItem.buffer, imgItem.uploadName);
    })
  );

  // thêm imgId vào
  const urlWithImgIds = urls.map((url, index) => ({
    url: url,
    imgId: imgItems[index].imgId,
  }));

  // apply vào lộ trình
  return itinerary.map((iti) => {
    const images = iti.images.map((imgItem) => {
      const url = urlWithImgIds.find(
        (urlWithImgId) => urlWithImgId.imgId === imgItem.id
      )?.url;

      if (url) return { ...imgItem, url: url };
      return imgItem;
    });

    return { ...iti, images: images };
  });
};

module.exports.deleteRemovedItineraryImages = (
  newItinerary,
  oldItinerary,
  imageHandler
) => {
  const updatedItineraryImgItems = getItineraryImgItems(newItinerary);

  const oldItineraryImgItems = getItineraryImgItems(oldItinerary);

  const removedItineraryImgItems = oldItineraryImgItems.filter(
    (imgItem) =>
      !updatedItineraryImgItems.find((imgItem1) => imgItem1.id === imgItem.id)
  );

  for (let imgItem of removedItineraryImgItems) {
    imageHandler.deleteByUrl(imgItem.url);
  }
};

module.exports.updateItineraryImageNames = async (
  newItinerary,
  oldItinerary,
  imageHandler
) => {
  const oldImgItems = getItineraryImgItems(oldItinerary);

  return await Promise.all(
    newItinerary.map(async (itineraryItem) => {
      const images = await Promise.all(
        itineraryItem.images.map(async (imageItem) => {
          const changedCaptionItem = oldImgItems.find(
            (item) =>
              item.id === imageItem.id && item.caption !== imageItem.caption
          );
          if (!changedCaptionItem) return imageItem;
          const slug = stringHandler.slugify(imageItem.caption);
          const newImageUrl = await imageHandler.renameImage(
            imageItem.url,
            slug
          );
          return { ...imageItem, url: newImageUrl };
        })
      );

      return { ...itineraryItem, images };
    })
  );
};
