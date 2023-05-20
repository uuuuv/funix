const createError = require("../../helpers/errorCreator");
const { object, string } = require("yup");
const Place = require("../../models/place.model");

module.exports = async (req, res, next) => {
  try {
    const MUST_BE_STRING = "Phải là chuỗi";
    const placeSchema = object({
      type: string().typeError(MUST_BE_STRING).required("Thiếu loại"),
      continent: string().typeError(MUST_BE_STRING).required("Thiếu châu lục"),
      name: string().typeError(MUST_BE_STRING).required("Thiếu tên"),
      region: string().typeError(MUST_BE_STRING).optional(),
      image: string().typeError(MUST_BE_STRING).optional(),
      en: object({
        name: string()
          .typeError(MUST_BE_STRING)
          .required("Bản tiếng Anh: Thiếu tên"),
      }).required("Thiếu bản tiếng Anh"),
    });

    try {
      await placeSchema.validate(req.body);
    } catch (error) {
      return next(createError(new Error(""), 400, error.message));
    }

    const placeWithTheSameName = await Place.findOne({
      name: req.body.name,
    });
    if (placeWithTheSameName) {
      return next(createError(new Error(""), 400, "Tên đã tồn tại."));
    }

    const placeWithTheSameNameEN = await Place.findOne({
      "en.name": req.body.en.name,
    });
    if (placeWithTheSameNameEN) {
      return next(createError(new Error(""), 400, "Tên tiếng Anh đã tồn tại."));
    }

    const placeWithTheSameSlug = await Place.findOne({
      slug: req.body.slug,
    });
    if (placeWithTheSameSlug) {
      return next(createError(new Error(""), 400, "Slug đã tồn tại."));
    }

    return next();
  } catch (error) {
    return next(createError(error, 500));
  }
};
