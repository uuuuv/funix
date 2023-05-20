const Place = require("../../models/place.model");
const placesTemplate = require("./places.json");
const GuideCategory = require("../../models/guides-category.model");
const guideCategoryTemplate = require("./guideCategory.json");

async function initPlaces() {
  const places = await Place.find();
  if (places.length === 0) {
    await Place.insertMany(placesTemplate);
  }

  const guideCategory = await GuideCategory.find();
  if (guideCategory.length === 0) {
    await GuideCategory.insertMany(guideCategoryTemplate);
  }
}

module.exports = initPlaces;
