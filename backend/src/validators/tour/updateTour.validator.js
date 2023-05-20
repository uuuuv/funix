const Tour = require("../../models/tour.model");
const Place = require("../../models/place.model");
const createError = require("../../helpers/errorCreator");
const {
  yupDeltaSchema,
  yupCheckEmptyDelta,
} = require("../../helpers/quillDelta");
const { object, string, number, array, boolean, mixed } = require("yup");

module.exports = async (req, res, next) => {
  const MUST_BE_STRING = "Phải là chuỗi";
  const newTour = {
    _id: req.body._id,
    code: req.body.code,
    slug: req.body.slug,
    thumb: (req.files?.thumb && req.files.thumb[0]) || req.body.thumb,
    banner: (req.files?.banner && req.files.banner[0]) || req.body.banner,
    itineraryImages:
      req.files?.itineraryImages ||
      (req.body.itinerary &&
        JSON.parse(req.body.itinerary).reduce(
          (acc, cur) => [...acc, ...cur.images],
          []
        )) ||
      null,

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

  const tourSchema = object(
    {
      _id: string().typeError(MUST_BE_STRING).required("thiếu tour id"),
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
      thumb: mixed().required("thiếu hình đại diện"),
      banner: mixed().required("thiếu hình banner"),
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
          .typeError("số đêm phải là số nguyên lớn hơn 0")
          .integer("số đêm phải là số nguyên lớn hơn 0")
          .required("số đêm là bắt buộc"),
      }).required("thiếu khoảng thời gian du lịch"),

      departure_dates: array("ngày khởi hành phải là mảng")
        .of(number("ngày khởi hành phải chứa số (timestamp)"))
        .optional(),
      departure_dates_text: string(
        "ngày khởi hành - chữ phải là chuỗi"
      ).optional(),

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
                caption: string("mô tả hình lộ trình phải là string").required(
                  "thiếu mô tả hình lộ trình"
                ),
                id: string("id ảnh lộ trình phải là string").required(
                  "thiếu id ảnh lộ trình"
                ),
                isSlider: boolean().default(false),
                url: string("thiếu url hình lộ trình").default(""),
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
          .test(yupCheckEmptyDelta("phương thức thanh toán không được trống")),
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
        start_at_text: string().typeError(MUST_BE_STRING).optional(),
        departure_dates_text: string().typeError(MUST_BE_STRING).optional(),

        highlights: yupDeltaSchema
          .required("Bản tiếng Anh: thiếu điểm nổi bật")
          .test(
            yupCheckEmptyDelta("Bản tiếng Anh: điểm nổi bật không được trống")
          ),

        price_policies: object({
          includes: yupDeltaSchema.required("Bản tiếng Anh: thiếu giá bao gồm"),
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
    try {
      await tourSchema.validate(newTour);
    } catch (error) {
      return next(createError(new Error(""), 400, error.message));
    }

    const foundTour = await Tour.findById(req.body._id);
    if (!foundTour) {
      return next(createError(new Error(""), 400, "Không tìm thấy tour."));
    }

    // nếu đổi code và code mới đổi bị trùng
    const tourWithTheSameCode = await Tour.findOne({
      code: req.body.code,
      _id: { $ne: req.body._id },
    });
    if (tourWithTheSameCode) {
      return next(createError(new Error(""), 400, "Mã tour đã tồn tại."));
    }

    const toursWithTheSameName = await Tour.findOne({
      name: req.body.name,
      _id: { $ne: req.body._id },
    });

    if (toursWithTheSameName) {
      return next(createError(new Error(""), 400, "Tên tour đã tồn tại."));
    }

    const toursWithTheSameSlug = await Tour.findOne({
      slug: req.body.slug,
      _id: { $ne: req.body._id },
    });

    if (toursWithTheSameSlug) {
      return next(createError(new Error(""), 400, "Slug đã tồn tại."));
    }

    // điểm khởi hành
    if (!req.body.start_at && !req.body.start_at_text) {
      return next(createError(new Error(""), 400, "Thiếu điểm khởi hành."));
    }

    if (req.body.start_at_text && !JSON.parse(req.body.en).start_at_text) {
      return next(
        createError(
          new Error(""),
          400,
          "Bản tiếng Anh: thiếu chú thích điểm khởi hành"
        )
      );
    }

    // ngày khởi hành
    if (
      JSON.parse(req.body.departure_dates).length === 0 &&
      !req.body.departure_dates_text
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
          "Bản tiếng Anh: thiếu chú thích ngày khởi hành"
        )
      );
    }

    const destinations = await Promise.all(
      newTour.destinations.map((item) => Place.findById(item))
    );

    req.tour = foundTour;
    req.destinations = destinations;
    return next();
  } catch (error) {
    return next(createError(error, 500));
  }
};
