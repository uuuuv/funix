const createError = require("../../helpers/errorCreator");
const Place = require("../../models/place.model");
const Tour = require("../../models/tour.model");
const Visa = require("../../models/visa.model");
const path = require("path");
const rootDir = require("../../helpers/rootDir");
const ImageHandler = require("../../helpers/imageHandler");
const fs = require("fs");
const fsPromises = fs.promises;
const logger = require("../../helpers/logger");
const mongoose = require("mongoose");

const BASE_IMAGE_FOLDER_PATH = path.join(
  rootDir,
  process.env.IMAGES_UPLOAD_DESTINATION_FOLDER
);

const BASE_IMAGE_URL_PREFIX = process.env.IMAGES_DESTINATION_URL_PREFIX;

module.exports.addPlace = async (req, res, next) => {
  const _id = new mongoose.Types.ObjectId().toString();
  const slug = req.body.slug;
  const folderPath = path.join(BASE_IMAGE_FOLDER_PATH, _id);
  const urlPrefix = `${BASE_IMAGE_URL_PREFIX}/${_id}`;
  const imageHandler = new ImageHandler(folderPath, urlPrefix);
  try {
    await fsPromises.mkdir(folderPath);

    let imageUrl = req.body.image;
    const imageFile = req.file;
    if (imageFile) {
      imageUrl = await imageHandler.saveImageToDisk(imageFile, slug);
    }

    const newPlace = await Place.create({
      ...req.body,
      _id,
      image: imageUrl,
    });

    return res.status(200).json({
      message: "Thành công",
      data: newPlace,
    });
  } catch (error) {
    fs.rm(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
        logger(err.stack);
      }
    });
    return next(createError(error, 500));
  }
};

module.exports.updatePlace = async (req, res, next) => {
  const _id = req.body._id;
  const folderPath = path.join(BASE_IMAGE_FOLDER_PATH, _id);
  const urlPrefix = `${BASE_IMAGE_URL_PREFIX}/${_id}`;
  const imageHandler = new ImageHandler(folderPath, urlPrefix);
  try {
    const place = req.place;
    const newSlug = req.body.slug;

    if (!fs.existsSync(folderPath)) {
      await fsPromises.mkdir(folderPath);
    }

    let imageUrl = req.body.image;
    const imageFile = req.file;
    if (imageFile) {
      imageUrl = await imageHandler.saveImageToDisk(imageFile, newSlug);
    }

    if (!imageFile && newSlug !== place.slug && place.image) {
      imageUrl = await imageHandler.renameImage(place.image, newSlug);
    }

    place.type = req.body.type;
    place.continent = req.body.continent;
    place.region = req.body.region;
    place.name = req.body.name;
    place.en = req.body.en;
    place.slug = req.body.slug;
    place.image = req.body.imageUrl;

    await place.save();

    return res.status(200).json({
      message: "Thành công",
      data: place,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.getPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();

    return res.status(200).json({
      data: places,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.deletePlace = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const place = await Place.findOne({ _id });
    if (!place) {
      return next(createError(new Error(""), 400, "Không tìm thấy địa điểm"));
    }

    const tour = await Tour.findOne({
      destinations: {
        $in: [_id],
      },
    });
    if (tour) {
      return next(
        createError(new Error(""), 400, "Địa điểm đang được sử dụng.")
      );
    }

    const visa = await Visa.findOne({
      country: _id,
    });
    if (visa) {
      return next(
        createError(new Error(""), 400, "Địa điểm đang được sử dụng.")
      );
    }

    const result = await Place.findByIdAndDelete(_id);
    if (result) {
      return res.status(200).json({
        message: "Thành công",
      });
    } else {
      throw new Error("Place not found");
    }
  } catch (error) {
    return next(createError(error, 500));
  }
};
