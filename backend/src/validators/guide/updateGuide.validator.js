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
    const guideSchema = object({
      _id: string("_id phải là chuỗi").required("Thiếu _id"),
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

    let currentGuide = {};
    try {
      currentGuide = JSON.parse(req.body.guide);
    } catch (error) {
      return next(createError(new Error(""), 400, "JSON guide không hợp lệ"));
    }

    const banner =
      (req.files.banner && req.files.banner[0]) || currentGuide.banner;
    const thumb = (req.files.thumb && req.files.thumb[0]) || currentGuide.thumb;

    if (!banner) {
      return next(createError(new Error(""), 400, "Thiếu hình banner"));
    }

    if (!thumb) {
      return next(createError(new Error(""), 400, "Thiếu hình đại diện"));
    }

    try {
      await guideSchema.validate(currentGuide);
    } catch (error) {
      return next(createError(new Error(""), 400, error.message));
    }

    const foundGuide = await Guide.findOne({ _id: currentGuide._id });
    if (!foundGuide) {
      return next(createError(new Error(""), 400, "Không tìm thấy guide"));
    }

    const guideWithTheSameTitle = await Guide.findOne({
      title: currentGuide.title,
      _id: {
        $ne: currentGuide._id,
      },
    });
    if (guideWithTheSameTitle) {
      return next(createError(new Error(""), 400, "Tiêu đề  đã tồn tại."));
    }

    const guideWithTheSameTitleEN = await Guide.findOne({
      "en.title": currentGuide.en.title,
      _id: {
        $ne: currentGuide._id,
      },
    });
    if (guideWithTheSameTitleEN) {
      return next(
        createError(new Error(""), 400, "Tiêu đề  tiếng Anh đã tồn tại.")
      );
    }

    const guideWithTheSameSlug = await Guide.findOne({
      slug: currentGuide.slug,
      _id: {
        $ne: currentGuide._id,
      },
    });
    if (guideWithTheSameSlug) {
      return next(createError(new Error(""), 400, "Slug đã tồn tại."));
    }

    const category = await GuidesCategory.findOne({
      _id: currentGuide.category,
    });
    if (!category) {
      return next(createError(new Error(""), 400, "Không tìm thấy danh mục."));
    }

    req.category = category;

    return next();
  } catch (error) {
    return next(createError(error, 500));
  }
};
