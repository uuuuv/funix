const express = require("express");
const router = express.Router();

const { imageHandler } = require("../controllers/imageHandler.controller");

router.get("*", imageHandler);

module.exports = router;
