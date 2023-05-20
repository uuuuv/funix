const express = require("express");
const router = express.Router();

// controllers
const {
  getTours,
  bookTour,
  callMeBack,
  getTourBySlug,
  countTourViews,
} = require("../../controllers/client/tour.controller");

// middlewares
const requestLimiter = require("../../middlewares/requestLimiter.middleware");
const cache = require("../../middlewares/cache.middleware");

// routes
router.get("/", requestLimiter(), cache(), getTours);
router.post("/booking", requestLimiter(), bookTour);
router.post("/advisory", requestLimiter(), callMeBack);
router.get("/:slug", requestLimiter(), countTourViews, cache(), getTourBySlug);

module.exports = router;
