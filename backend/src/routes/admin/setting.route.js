const express = require("express");
const router = express.Router();

// controllers
const {
  getSettings,
  updateSettings,
} = require("../../controllers/admin/settings.controller");

// validator
const updateSettingsValidator = require("../../validators/settings/updateSettings.validator");

// middlewares
const { ADMIN, MODERATOR, CLIENT } = require("../../config/auth.config");
const requireAuth = require("../../middlewares/requireAuth.middleware");

// routes
router.get("/", requireAuth(MODERATOR), getSettings);
router.put("/", requireAuth(ADMIN), updateSettingsValidator, updateSettings);

module.exports = router;
