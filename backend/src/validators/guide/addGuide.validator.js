const { string, object } = require("yup");
const createError = require("../../helpers/errorCreator");
const Guide = require("../../models/guide.model");
const GuidesCategory = require("../../models/guides-category.model");
const {
  yupDeltaSchema,
  yupCheckEmptyDelta,
} = require("../../helpers/quillDelta");

module.exports = async (req, res, next) => {
  try {
    if (!req.body.guide) {
      return next(createError(new Error(""), 400, "Thiếu guide"));
    }

    const guideSchema = object({
      title: string("Tiêu đề phải là chuỗi").required("Thiếu tiêu đề"),
      slug: string("Slug phải là chuỗi").required("Thiếu slug"),
      author: string("Tác giả phải là chuỗi").required("Thiếu tác giả"),
      category: string("Danh mục phải là chuỗi").required("Thiếu danh mục"),
      origin: string("Nguồn phải là chuỗi").optional(),
      content: yupDeltaSchema
        .test(yupCheckEmptyDelta("Nội dung không được trống"))
        .required("Thiếu nội dung"),
      en: object({
        title: string("Bản tiếng Anh: tiêu đề phải là chuỗi").required(
          "Bản tiếng Anh: Thiếu tiêu đề"
        ),
        content: yupDeltaSchema
          .test(yupCheckEmptyDelta("Bản tiếng Anh: nội dung không được trống"))
          .required("Bản tiếng Anh: Thiếu nội dung"),
      }).required("Thiếu bản tiếng Anh"),
    });

    try {
      JSON.parse(req.body.guide);
    } catch (error) {
      return next(createError(new Error(""), 400, "JSON guide không hợp lệ"));
    }

    const banner = req.files.banner && req.files.banner[0];
    const thumb = req.files.thumb && req.files.thumb[0];

    if (!banner) {
      return next(createError(new Error(""), 400, "Thiếu hình banner"));
    }

    if (!thumb) {
      return next(createError(new Error(""), 400, "Thiếu hình đại diện"));
    }

    const newGuide = {
      ...JSON.parse(req.body.guide),
    };

    try {
      await guideSchema.validate(newGuide);
    } catch (error) {
      return next(createError(new Error(""), 400, error.message));
    }

    const guideWithSameTitle = await Guide.findOne({
      title: newGuide.title,
    });
    if (guideWithSameTitle) {
      return next(createError(new Error(""), 400, "Tiêu đề đã tồn tại."));
    }

    const guideWithSameTitleEN = await Guide.findOne({
      "en.title": newGuide.en.title,
    });
    if (guideWithSameTitleEN) {
      return next(
        createError(new Error(""), 400, "Tiêu đề tiếng Anh đã tồn tại.")
      );
    }

    const guideWithSameSlug = await Guide.findOne({
      slug: newGuide.slug,
    });
    if (guideWithSameSlug) {
      return next(createError(new Error(""), 400, "Slug đã tồn tại."));
    }

    const category = await GuidesCategory.findOne({ _id: newGuide.category });
    if (!category) {
      return next(createError(new Error(""), 400, "Không tìm thấy danh mục."));
    }

    req.category = category;

    return next();
  } catch (error) {
    return next(createError(error, 500));
  }
};
