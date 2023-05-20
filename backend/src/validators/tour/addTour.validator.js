const Tour = require("../../models/tour.model");
const createError = require("../../helpers/errorCreator");
const { object, string, number, array, boolean } = require("yup");
const {
  yupDeltaSchema,
  yupCheckEmptyDelta,
} = require("../../helpers/quillDelta");

module.exports = async (req, res, next) => {
  try {
    const newTour = {
      code: req.body.code,
      slug: req.body.slug,
      thumb: req.files?.thumb && req.files.thumb[0],
      banner: req.files?.banner && req.files.banner[0],
      itineraryImages: req.files?.itineraryImages,

      name: req.body.name,
      journey: req.body.journey,
      description: req.body.description,
      highlights: JSON.parse(req.body.highlights || null),

      price: Number(req.body.price),

      duration: JSON.parse(req.body.duration || null),

      destinations: JSON.parse(req.body.destinations || null),
      departure_dates: JSON.parse(req.body.departure_dates || null),
      departure_dates_text: req.body.departure_dates_text,

      start_at: req.body.start_at,
      start_at_text: req.body.start_at_text,

      price_policies: JSON.parse(req.body.price_policies || null),
      terms: JSON.parse(req.body.terms || null),
      rating: JSON.parse(req.body.rating || null),

      itinerary: JSON.parse(req.body.itinerary || null),
      en: JSON.parse(req.body.en || null),
    };

    const MUST_BE_STRING = "Phải là chuỗi";
    const tourSchema = object(
      {
        code: string().typeError(MUST_BE_STRING).required("thiếu mã tour"),
        slug: string("Slug phải là chuỗi").required("Thiếu slug"),
        name: string().typeError(MUST_BE_STRING).required("thiếu tên tour"),
        journey: string().typeError(MUST_BE_STRING).required("thiếu lộ trình"),
        description: string().typeError(MUST_BE_STRING).required("thiếu mô tả"),
        highlights: yupDeltaSchema
          .required("thiếu highlights")
          .test(yupCheckEmptyDelta("điểm nổi bật không được trống")),
        destinations: array("điểm đến phải là mảng")
          .of(string())
          .min(1, "thiếu điểm đến")
          .required("thiếu điểm đến"),
        start_at: string().typeError(MUST_BE_STRING).optional(),
        start_at_text: string().typeError(MUST_BE_STRING).optional(),
        itineraryImages: array()
          .min(1, "thiếu ảnh lộ trình")
          .required("thiếu ảnh lộ trình"),
        thumb: object().required("thiếu hình đại diện"),
        banner: object().required("thiếu hình banner"),
        price: number()
          .typeError("giá tour phải là số nguyên lớn hơn 0")
          .integer("giá tour phải là số nguyên lớn hơn 0")
          .positive("giá tour phải lớn hơn 0")
          .required("thiếu giá tour"),
        duration: object({
          days: number()
            .typeError("số ngày phải là số nguyên lớn hơn 0")
            .integer("số ngày phải là số nguyên lớn hơn 0")
            .required("số ngày du lịch là bắt buộc")
            .positive("số ngày phải lớn hơn 0"),
          nights: number()
            .typeError("số đêm phải là số nguyên lớn hơn hoặc bằng 0")
            .integer("số đêm phải là số nguyên lớn hơn hoặc bằng 0")
            .required("số đêm là bắt buộc"),
        }).required("thiếu khoảng thời gian du lịch"),

        departure_dates: array("ngày khởi hành phải là mảng")
          .of(number("ngày khởi hành phải chứa số (timestamp)"))
          .optional(),

        rating: array("đánh giá phải là mảng")
          .of(
            object({
              name: string("tên người đánh giá phải là chũ").required(
                "thiếu tên người đánh giá"
              ),
              stars: number("số sao phải là số")
                .required("số sao là bắt buộc")
                .min(1, "số sao phải là số nguyên từ 1 - 5")
                .max(5, "số sao phải là số nguyên từ 1 - 5"),
              content: string("nội dung đánh giá phải là chữ").required(
                "thiếu nội dung đánh giá"
              ),
            })
          )
          .required("thiếu đánh giá"),

        itinerary: array("lộ trình phải là mảng")
          .min(1, "thiếu lộ trình")
          .of(
            object({
              id: string("id phải là string").required("thiếu id lộ trình"),
              day: string("tiêu đề lộ trình phải là string").required(
                "thiếu tiêu đề lộ trình"
              ),
              destination: string("điểm đến lộ trình phải là string").required(
                "thiếu điểm đến lộ trình"
              ),
              images: array("ảnh lộ trình phải là mảng").of(
                object({
                  caption: string(
                    "mô tả hình lộ trình phải là string"
                  ).required("thiếu mô tả hình lộ trình"),
                  id: string("id ảnh lộ trình phải là string").required(
                    "thiếu id ảnh lộ trình"
                  ),
                  isSlider: boolean().default(false),
                })
              ),
              content: yupDeltaSchema
                .required("thiếu nội dung lộ trình")
                .test(yupCheckEmptyDelta("nội dung lộ trình không được trống")),
            })
          )
          .required("thiếu lộ trình"),

        price_policies: object({
          includes: yupDeltaSchema
            .required("thiếu giá bao gồm")
            .test(yupCheckEmptyDelta("giá bao gồm không được trống")),
          excludes: yupDeltaSchema
            .required("thiếu giá không bao gồm")
            .test(yupCheckEmptyDelta("giá không bao gồm không được trống")),
          other: yupDeltaSchema
            .required("thiếu giá phụ thu và trẻ em")
            .test(yupCheckEmptyDelta("giá phụ thu và trẻ em không được trống")),
        }).required("thiếu bảng giá"),

        terms: object({
          registration: yupDeltaSchema
            .required("thiếu điều kiện đăng ký")
            .test(yupCheckEmptyDelta("điểu kiện đăng ký không được trống")),
          cancellation: yupDeltaSchema
            .required("thiếu điều kiện hoàn hủy")
            .test(yupCheckEmptyDelta("điều kiện hoàn hủy không được trống")),
          payment: yupDeltaSchema
            .required("thiếu phương thức thanh toán")
            .test(
              yupCheckEmptyDelta("phương thức thanh toán không được trống")
            ),
          notes: yupDeltaSchema,
        }).required("thiếu điều khoản"),

        en: object({
          name: string("Bản tiếng Anh: tên tour phải là chuỗi").required(
            "Bản tiếng Anh: thiếu tên tour"
          ),
          journey: string("Bản tiếng Anh: lộ trình phải là chuỗi").required(
            "Bản tiếng Anh: thiếu lộ trình"
          ),
          description: string("Bản tiếng Anh: mô tả phải là chuỗi").required(
            "Bản tiếng Anh: thiếu mô tả"
          ),
          highlights: yupDeltaSchema
            .required("Bản tiếng Anh: thiếu điểm nổi bật")
            .test(
              yupCheckEmptyDelta("Bản tiếng Anh: điểm nổi bật không được trống")
            ),

          departure_dates_text: string().typeError(MUST_BE_STRING).optional(),
          start_at_text: string().typeError(MUST_BE_STRING).optional(),

          price_policies: object({
            includes: yupDeltaSchema.required(
              "Bản tiếng Anh: thiếu giá bao gồm"
            ),
            excludes: yupDeltaSchema.required(
              "Bản tiếng Anh: thiếu giá không bao gồm"
            ),
            other: yupDeltaSchema.required(
              "Bản tiếng Anh: thiếu giá trẻ em và phụ thu"
            ),
          }).required("Bản tiếng Anh: thiếu bảng giá"),

          terms: object({
            registration: yupDeltaSchema.required(
              "Bản tiếng Anh: thiếu điều kiện đăng ký"
            ),
            cancellation: yupDeltaSchema.required(
              "Bản tiếng Anh: thiếu điều kiện hoàn hủy"
            ),
            payment: yupDeltaSchema.required(
              "Bản tiếng Anh: thiếu phương thức thanh toán"
            ),
            notes: yupDeltaSchema,
          }).required("Bản tiếng Anh: thiếu điều khoản"),

          itinerary: array("Bản tiếng Anh: lộ trình phải là mảng")
            .of(
              object({
                day: string(
                  "Bản tiếng Anh: tiêu đều lộ trình phải là chuỗi"
                ).required("Bản tiếng Anh: thiếu tiêu đề lộ trình"),
                destination: string(
                  "Bản tiếng Anh: điểm đến lộ trình phải là chuỗi"
                ).required("Bản tiếng Anh: thiếu điểm đến lộ trình"),
                content: yupDeltaSchema
                  .required("Bản tiếng Anh: thiếu nội dung lộ trình")
                  .test(
                    yupCheckEmptyDelta(
                      "Bản tiếng Anh: nội dung lộ trình không được trống"
                    )
                  ),
                images: array("Bản tiếng Anh: ảnh lộ trình phải là mảng").of(
                  object({
                    id: string(
                      "Bản tiếng Anh: id ảnh lộ trình phải là chuỗi"
                    ).required("Bản tiếng Anh: thiếu id ảnh lộ trình"),
                    caption: string(
                      "Bản tiếng Anh: mô tả hình lộ trình phải là chuỗi"
                    ).required("Bản tiếng Anh: thiếu mô tả ảnh lộ trình"),
                  })
                ),
              })
            )
            .min(1, "Bản tiếng Anh: thiếu lộ trình")
            .required("Bản tiếng Anh: thiếu lộ trình"),
        }).required("thiếu bản tiếng Anh"),
      },
      { strict: true }
    );

    try {
      await tourSchema.validate(newTour);
    } catch (error) {
      return next(createError(new Error(""), 400, error.message));
    }

    const tourWithTheSameCode = await Tour.findOne({
      code: req.body.code.toLowerCase(),
    });
    if (tourWithTheSameCode) {
      return next(createError(new Error(""), 400, "Mã tour đã tồn tại."));
    }

    const tourWithTheSameName = await Tour.findOne({
      name: req.body.name,
    });
    if (tourWithTheSameName) {
      return next(createError(new Error(""), 400, "Tên tour đã tồn tại."));
    }

    const tourWithTheSameNameEN = await Tour.findOne({
      "en.name": req.body.en.name,
    });
    if (tourWithTheSameNameEN) {
      return next(
        createError(new Error(""), 400, "Tên tour tiếng Anh đã tồn tại.")
      );
    }

    const tourWithTheSameSlug = await Tour.findOne({
      slug: req.body.slug,
    });
    if (tourWithTheSameSlug) {
      return next(createError(new Error(""), 400, "Slug đã tồn tại."));
    }

    // điểm khởi hành
    if (
      !req.body.start_at &&
      !req.body.start_at_text &&
      !JSON.parse(req.body.en).start_at_text
    ) {
      return next(createError(new Error(""), 400, "Thiếu điểm khởi hành."));
    }

    if (req.body.start_at_text && !JSON.parse(req.body.en).start_at_text) {
      return next(
        createError(
          new Error(""),
          400,
          "Thiếu chú thích điểm khởi hành tiếng Anh"
        )
      );
    }

    if (!req.body.start_at_text && JSON.parse(req.body.en).start_at_text) {
      return next(
        createError(
          new Error(""),
          400,
          "Thiếu chú thích điểm khởi hành tiếng Việt"
        )
      );
    }

    // ngày khởi hành
    if (
      JSON.parse(req.body.departure_dates).length === 0 &&
      !req.body.departure_dates_text &&
      !JSON.parse(req.body.en).departure_dates_text
    ) {
      return next(createError(new Error(""), 400, "Thiếu ngày khởi hành."));
    }

    if (
      req.body.departure_dates_text &&
      !JSON.parse(req.body.en).departure_dates_text
    ) {
      return next(
        createError(
          new Error(""),
          400,
          "Bản tiếng Anh: Thiếu ngày khởi hành - thông tin thêm"
        )
      );
    }

    if (
      !req.body.departure_dates_text &&
      JSON.parse(req.body.en).departure_dates_text
    ) {
      return next(
        createError(
          new Error(""),
          400,
          "Thiếu ngày khởi hành - thông tin thêm (có bản tiếng Anh nhưng chưa có bản tiếng Việt)"
        )
      );
    }

    return next();
  } catch (error) {
    return next(createError(error, 500));
  }
};
