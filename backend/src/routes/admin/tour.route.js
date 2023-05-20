const express = require("express");
const router = express.Router();

// controllers
const {
  updateTour,
  deleteTour,
  getTours,
  updateHotTours,
  createTour,
  fetchSingleTour,
} = require("../../controllers/admin/tour.controller");

// middlewares
const multer = require("../../middlewares/multer.middleware");
const { ADMIN, MODERATOR } = require("../../config/auth.config");
const requireAuth = require("../../middlewares/requireAuth.middleware");

// validators
const addTourValidator = require("../../validators/tour/addTour.validator");
const updateTourValidator = require("../../validators/tour/updateTour.validator");
const deleteTourValidator = require("../../validators/tour/deleteTour.validator");
const updateHotToursValidator = require("../../validators/tour/updateHotTours.validator");

// routes
router.post(
  "/",
  requireAuth(ADMIN),
  multer.newTour,
  addTourValidator,
  createTour
);
router.put(
  "/",
  requireAuth(ADMIN),
  multer.newTour,
  updateTourValidator,
  updateTour
);
router.get("/", requireAuth(MODERATOR), getTours);
router.get("/:tourCode", requireAuth(MODERATOR), fetchSingleTour);
router.delete("/", requireAuth(ADMIN), deleteTourValidator, deleteTour);
router.put("/hot", requireAuth(ADMIN), updateHotToursValidator, updateHotTours);

module.exports = router;
