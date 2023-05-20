const path = require("path");
const fs = require("fs");
const logger = require("../../helpers/logger");
const fsPromises = fs.promises;
const Tour = require("../../models/tour.model");
const createError = require("../../helpers/errorCreator");
const ImageHandler = require("../../helpers/imageHandler");
const rootDir = require("../../helpers/rootDir");
const toursService = require("../../services/admin/tour.service");
const mongoose = require("mongoose");

const BASE_IMAGE_FOLDER_PATH = path.join(
  rootDir,
  process.env.IMAGES_UPLOAD_TOUR_FOLDER
);
const BASE_IMAGE_URL_PREFIX = process.env.IMAGES_TOUR_URL_PREFIX;

module.exports.getTours = async (req, res, next) => {
  try {
    let tours = await Tour.find(
      {},
      {
        _id: 1,
        code: 1,
        slug: 1,
        name: 1,
        destinations: 1,
        updatedAt: 1,
        hot: 1,
      }
    ).populate("destinations");

    // bỏ lộ trình và đánh giá và bản tiếng Anh
    tours = tours.map((tour) => {
      const { en, itinerary, rating, ...rest } = tour._doc;
      return rest;
    });

    return res.status(200).json({
      data: tours,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.createTour = async (req, res, next) => {
  const tourId = new mongoose.Types.ObjectId().toString();
  const slug = req.body.slug;
  const folderPath = path.join(BASE_IMAGE_FOLDER_PATH, tourId);
  const urlPrefix = `${BASE_IMAGE_URL_PREFIX}/${tourId}`;
  const imageHandler = new ImageHandler(folderPath, urlPrefix);

  try {
    await fsPromises.mkdir(folderPath);

    // upload hình đại diện
    const thumb = req.files.thumb[0];
    const thumbUrl = await imageHandler.saveImageToDisk(thumb, slug);

    // upload hình banner
    const banner = req.files.banner[0];
    const bannerUrl = await imageHandler.saveImageToDisk(banner, slug);

    // Handle hình lộ trình
    const itinerary = await toursService.putImagesToItinerary(
      JSON.parse(req.body.itinerary),
      req.files.itineraryImages,
      imageHandler
    );

    const newTour = {
      _id: tourId,
      code: req.body.code,
      slug,
      thumb: thumbUrl,
      banner: bannerUrl,

      name: req.body.name,
      journey: req.body.journey,
      description: req.body.description,
      highlights: JSON.parse(req.body.highlights),

      price: Number(req.body.price),

      duration: JSON.parse(req.body.duration),

      destinations: JSON.parse(req.body.destinations),
      departure_dates: JSON.parse(req.body.departure_dates),
      departure_dates_text: req.body.departure_dates_text,

      start_at_text: req.body.start_at_text,

      price_policies: JSON.parse(req.body.price_policies),
      terms: JSON.parse(req.body.terms),
      rating: JSON.parse(req.body.rating),

      itinerary: itinerary,
      en: JSON.parse(req.body.en),

      hot: false,
    };

    if (req.body.start_at) {
      newTour.start_at = req.body.start_at;
    }

    await Tour.create(newTour);

    const {
      en,
      itinerary: newTourItinerary,
      ...tourWithoutItineraryAndEn
    } = newTour;

    return res.status(200).json({
      data: tourWithoutItineraryAndEn,
      message: "Thành công",
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

module.exports.updateTour = async (req, res, next) => {
  const tourId = req.body._id;
  const newSlug = req.body.slug;
  const folderPath = path.join(BASE_IMAGE_FOLDER_PATH, tourId);
  const urlPrefix = `${BASE_IMAGE_URL_PREFIX}/${tourId}`;
  const imageHandler = new ImageHandler(folderPath, urlPrefix);

  try {
    if (!fs.existsSync(folderPath)) {
      await fsPromises.mkdir(folderPath);
    }

    const tour = await Tour.findOne({ _id: tourId });
    const oldSlug = tour.slug;
    let oldThumbUrl = tour.thumb;
    let oldBannerUrl = tour.banner;
    let newThumbUrl = "";
    let newBannerUrl = "";

    // hình đại diện
    const newUploadedThumb = req.files?.thumb?.[0];
    const newUploadedBanner = req.files?.banner?.[0];

    if (newUploadedThumb) {
      newThumbUrl = await imageHandler.saveImageToDisk(
        newUploadedThumb,
        newSlug
      );
      // imageHandler.deleteByUrl(tour.thumb);
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

    // hình lộ trình
    let newItinerary = JSON.parse(req.body.itinerary);

    // nếu có hình mới được upload lên thì upload hình:
    const hasNewItineraryImages = req.files.itineraryImages?.length;
    if (hasNewItineraryImages) {
      newItinerary = await toursService.putImagesToItinerary(
        newItinerary,
        req.files.itineraryImages,
        imageHandler
      );
    }

    // đổi tên file hình lộ trình nếu caption thay đổi
    newItinerary = await toursService.updateItineraryImageNames(
      newItinerary,
      tour.itinerary,
      imageHandler
    );

    tour.code = req.body.code;
    tour.slug = newSlug;
    tour.thumb = newThumbUrl || oldThumbUrl;
    tour.banner = newBannerUrl || oldBannerUrl;
    tour.name = req.body.name;
    tour.hot = tour.hot;

    tour.journey = req.body.journey;
    tour.description = req.body.description;
    if (req.body.start_at && req.body.start_at !== "undefined") {
      tour.start_at = req.body.start_at;
    }
    tour.start_at_text = req.body.start_at_text;
    tour.highlights = JSON.parse(req.body.highlights);
    tour.price = Number(req.body.price);
    tour.duration = JSON.parse(req.body.duration);
    tour.destinations = JSON.parse(req.body.destinations);
    tour.departure_dates = JSON.parse(req.body.departure_dates);
    tour.departure_dates_text = req.body.departure_dates_text;
    tour.price_policies = JSON.parse(req.body.price_policies);
    tour.terms = JSON.parse(req.body.terms);
    tour.rating = JSON.parse(req.body.rating);
    tour.itinerary = newItinerary;
    tour.en = JSON.parse(req.body.en);

    await tour.save();

    return res.status(200).json({
      data: {
        _id: tour._id,
        code: tour.code,
        name: tour.name,
        slug: tour.slug,
        destinations: req.destinations.map((item) => ({
          _id: item._id,
          type: item.type,
          continent: item.continent,
          region: item.region,
          name: item.name,
          slug: item.slug,
        })),
      },
      message: "Thành công",
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.updateHotTours = async (req, res, next) => {
  try {
    const tourIds = req.body.tourIds;
    await Tour.updateMany(
      {
        _id: {
          $in: tourIds,
        },
      },
      { hot: true }
    );

    await Tour.updateMany(
      {
        _id: {
          $nin: tourIds,
        },
        hot: true,
      },
      { hot: false }
    );

    return res.status(200).json({
      message: "Thành công",
      data: tourIds,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.fetchSingleTour = async (req, res, next) => {
  try {
    let { tourCode } = req.params;

    const tour = await Tour.findOne({ code: tourCode });

    if (!tour) {
      return next(createError(new Error(""), 400, "Not Found"));
    }

    return res.status(200).json({
      data: tour,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.deleteTour = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const result = await Tour.findOneAndDelete({ _id });

    return res.status(200).json({
      message: "Thành công",
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};
