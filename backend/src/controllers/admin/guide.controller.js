const Guide = require("../../models/guide.model");
const createError = require("../../helpers/errorCreator");
const {
  getBase64ImgsFromQuillDelta,
  saveBase64ImgsToDisk,
  updateContentImageNames,
} = require("../../services/admin/guide.service");
const mongoose = require("mongoose");

const GuidesCategory = require("../../models/guides-category.model");
const ImageHandler = require("../../helpers/imageHandler");
const fsPromises = require("fs").promises;
const path = require("path");
const rootDir = require("../../helpers/rootDir");
const fs = require("fs");

const BASE_IMAGE_FOLDER_PATH = path.join(
  rootDir,
  process.env.IMAGES_UPLOAD_GUIDE_FOLDER
);
const BASE_IMAGE_URL_PREFIX = process.env.IMAGES_GUIDE_URL_PREFIX;

module.exports.fetchGuides = async (req, res, next) => {
  try {
    let guides = await Guide.find(
      {},
      { _id: 1, title: 1, category: 1, slug: 1 }
    ).populate("category");
    const category = await GuidesCategory.find();

    return res.status(200).json({
      data: guides,
      metadata: {
        category,
      },
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.addGuide = async (req, res, next) => {
  const _id = new mongoose.Types.ObjectId().toString();
  let guideString = req.body.guide;
  let guide = JSON.parse(guideString);
  const slug = guide.slug;
  const folderPath = path.join(BASE_IMAGE_FOLDER_PATH, _id);
  const urlPrefix = `${BASE_IMAGE_URL_PREFIX}/${_id}`;
  const imageHandler = new ImageHandler(folderPath, urlPrefix);

  try {
    await fsPromises.mkdir(folderPath);

    const bannerUrl = await imageHandler.saveImageToDisk(
      req.files.banner[0],
      slug,
      imageHandler
    );
    const thumbUrl = await imageHandler.saveImageToDisk(
      req.files.thumb[0],
      slug,
      imageHandler
    );

    // lấy image base64 [ {base64String, caption }]
    let base64Imgs = getBase64ImgsFromQuillDelta(guide.content);

    // lưu vào ổ đĩa
    let imageUrls = await saveBase64ImgsToDisk(base64Imgs, imageHandler);

    // ráp urls vào bài viết
    base64Imgs.forEach((item, index) => {
      while (guideString.includes(item.base64String)) {
        guideString = guideString.replace(item.base64String, imageUrls[index]);
      }
    });

    const newGuide = await Guide.create({
      _id: _id,
      ...JSON.parse(guideString),
      banner: bannerUrl,
      thumb: thumbUrl,
      slug: slug,
    });

    newGuide.category = req.category;

    return res.status(200).json({
      message: "Thành công",
      data: newGuide,
    });
  } catch (error) {
    fs.rm(folderPath, { recursive: true }, (err) => {
      console.log(err);
    });
    return next(createError(error, 500));
  }
};

module.exports.updateGuide = async (req, res, next) => {
  let newGuideString = req.body.guide;
  let newGuide = JSON.parse(newGuideString);
  const _id = newGuide._id;
  const newSlug = newGuide.slug;

  const folderPath = path.join(BASE_IMAGE_FOLDER_PATH, _id);
  const urlPrefix = `${BASE_IMAGE_URL_PREFIX}/${_id}`;

  const imageHandler = new ImageHandler(folderPath, urlPrefix);

  try {
    let guide = await Guide.findOne({ _id });
    let oldSlug = guide.slug;

    // handle: upload hình base64 mới trong content
    let base64Imgs = getBase64ImgsFromQuillDelta(newGuide.content);
    let imageUrls = await saveBase64ImgsToDisk(base64Imgs, imageHandler);

    // ráp hình vào
    base64Imgs.forEach((item, index) => {
      while (newGuideString.includes(item.base64String)) {
        newGuideString = newGuideString.replace(
          item.base64String,
          imageUrls[index]
        );
      }
    });

    // thumbnail and banner
    const newUploadedThumb = req.files.thumb && req.files.thumb[0];
    const newUploadedBanner = req.files.banner && req.files.banner[0];

    let oldThumbUrl = guide.thumb;
    let oldBannerUrl = guide.banner;
    let newThumbUrl = "";
    let newBannerUrl = "";

    if (newUploadedThumb) {
      newThumbUrl = await imageHandler.saveImageToDisk(
        newUploadedThumb,
        newSlug
      );
    }

    if (!newUploadedThumb && oldSlug !== newSlug) {
      newThumbUrl = await imageHandler.renameImage(oldThumbUrl, newSlug);
    }

    if (newUploadedBanner) {
      newBannerUrl = await imageHandler.saveImageToDisk(
        newUploadedBanner,
        newSlug
      );
    }

    if (!newUploadedBanner && oldSlug !== newSlug) {
      newBannerUrl = await imageHandler.renameImage(oldBannerUrl, newSlug);
    }

    // đổi image name nếu caption thay đổi
    newGuideString = await updateContentImageNames(
      JSON.parse(newGuideString),
      guide,
      imageHandler
    );

    guide.title = newGuide.title;
    guide.content = JSON.parse(newGuideString).content;
    guide.author = newGuide.author;
    guide.origin = newGuide.origin;
    guide.category = newGuide.category;
    guide.en = JSON.parse(newGuideString).en;
    guide.thumb = newThumbUrl || oldThumbUrl;
    guide.banner = newBannerUrl || oldBannerUrl;
    guide.slug = newSlug;
    guide.createdAt = newGuide.createdAt;

    await guide.save();
    return res.status(200).json({
      message: "Thành công",
      data: {
        _id: guide._id,
        title: guide.title,
        category: req.category,
      },
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.fetchSingleGuide = async (req, res, next) => {
  try {
    let { slug } = req.params;
    const guide = await Guide.findOne({ slug });

    return res.status(200).json({
      data: guide,
      message: "Thành công",
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.deleteGuide = async (req, res, next) => {
  try {
    const { _id } = req.body;

    await Guide.deleteOne({ _id });
    return res.status(200).json({
      message: "Thành công",
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.addCategoryItem = async (req, res, next) => {
  try {
    const newCategoryItem = await GuidesCategory.create(req.body);

    return res.status(200).json({
      message: "Thành công",
      data: newCategoryItem,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.updateCategoryItem = async (req, res, next) => {
  try {
    let categoryItem = req.categoryItem;
    categoryItem.name = req.body.name;
    categoryItem.slug = req.body.slug;
    categoryItem.en.name = req.body.en.name;

    await categoryItem.save();

    return res.status(200).json({
      message: "Thành công",
      data: categoryItem,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.fetchCategory = async (req, res, next) => {
  try {
    const category = await GuidesCategory.find();
    return res.status(200).json({
      data: category,
      message: "Thành công",
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.deleteCategoryItem = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const guide = await Guide.findOne({ category: _id });
    if (guide) {
      return next(
        createError(new Error(""), 400, "Category đang được sử dụng")
      );
    }

    const result = await GuidesCategory.deleteOne({ _id });
    if (result.deletedCount === 0) {
      throw new Error("Guide not found");
    }

    return res.status(200).json({
      message: "Thành công",
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};
