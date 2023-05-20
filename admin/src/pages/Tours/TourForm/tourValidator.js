import {
  mediumTextValidator as mt,
  longTextValidator as lt,
  slugValidator,
} from "../../../services/helpers/validator.helper";

const tourValidator = (v) => {
  const isEmptyDelta = (delta) => {
    if (!delta) return true;
    const ops = delta.ops;
    if (!ops) return true;
    return ops.length === 1 && !Boolean(ops[0].insert.trim());
  };

  const REQUIRED = "Bắt buộc";
  const errors = {};

  let m = [];

  // code
  if (!/^[a-z0-9]{1,255}$/gi.test(v.code)) {
    m.push({
      field: "Mã tour",
      message:
        "1 - 255 ký tự. Chỉ chứa ký tự latin và chữ số không dấu. Không được chứa khoảng trắng.",
    });
  }

  // name
  if (mt(v.name)) {
    m.push({
      field: "Tên tour",
      message: mt(v.name),
    });
  }

  if (mt(v.en.name)) {
    m.push({
      field: "Tên tour (EN)",
      message: mt(v.en.name),
    });
  }

  // slug
  if (slugValidator(v.slug)) {
    m.push({
      field: "Slug",
      message: slugValidator(v.slug),
    });
  }

  // journey
  if (mt(v.journey)) {
    m.push({
      field: "Hành trình",
      message: mt(v.journey),
    });
  }

  if (mt(v.en.journey)) {
    m.push({
      field: "Hành trình (EN)",
      message: mt(v.en.journey),
    });
  }

  // description
  if (lt(v.description)) {
    m.push({
      field: "Mô tả",
      message: lt(v.description),
    });
  }

  if (lt(v.en.description)) {
    m.push({
      field: "Mô tả (EN)",
      message: lt(v.en.description),
    });
  }

  // highlights
  if (isEmptyDelta(v.highlights)) {
    m.push({
      field: "Điểm nổi bật",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.highlights)) {
    m.push({
      field: "Điểm nổi bật (EN)",
      message: REQUIRED,
    });
  }

  // departure dates
  if (
    v.departure_dates.length === 0 &&
    !v.departure_dates_text.trim() &&
    !v.en.departure_dates_text.trim()
  ) {
    m.push({
      field: "Ngày khởi hành",
      message: "Phải có ngày khởi hành cụ thể hoặc ghi chú",
    });
  }

  if (v.departure_dates_text.trim() && !v.en.departure_dates_text.trim()) {
    m.push({
      field: "Ngày khởi hành",
      message: "Thiếu ghi chú tiếng Anh",
    });
  }

  if (!v.departure_dates_text.trim() && v.en.departure_dates_text.trim()) {
    m.push({
      field: "Ngày khởi hành",
      message: "Thiếu ghi chú tiếng Việt",
    });
  }

  if (mt(v.departure_dates_text, true)) {
    m.push({
      field: "Ghi chú ngày khởi hành",
      message: mt(v.departure_dates_text, true),
    });
  }

  if (mt(v.en.departure_dates_text, true)) {
    m.push({
      field: "Ghi chú ngày khởi hành (EN)",
      message: mt(v.en.departure_dates_text, true),
    });
  }

  // duration
  if (Math.abs(Number(v.duration_days) - Number(v.duration_nights)) > 1) {
    m.push({
      field: "Số ngày, đêm",
      message: "Chênh lệch ngày đêm không được lớn hơn 1",
    });
  }

  // price
  if (Number(v.price) < 0 || Number(v.price) > 1000000000) {
    m.push({
      field: "Giá tour",
      message: "Gía tour từ 0 - 1.000.000.000",
    });
  }

  // destinations
  if (v.destinations.length === 0) {
    m.push({
      field: "Điểm đến",
      message: REQUIRED,
    });
  }

  // start at
  if (!v.start_at && !v.start_at_text.trim() && !v.en.start_at_text.trim()) {
    m.push({
      field: "Điểm khởi hành",
      message: "Phải có điểm khởi hành cụ thể hoặc ghi chú",
    });
  }

  if (v.start_at_text.trim() && !v.en.start_at_text.trim()) {
    m.push({
      field: "Điểm khởi hành",
      message: "Thiếu ghi chú tiếng Anh",
    });
  }

  if (!v.start_at_text.trim() && v.en.start_at_text.trim()) {
    m.push({
      field: "Điểm khởi hành",
      message: "Thiếu ghi chú tiếng Việt",
    });
  }

  if (mt(v.start_at_text, true)) {
    m.push({
      field: "Ghi chú điểm khởi hành",
      message: mt(v.start_at_text, true),
    });
  }

  if (mt(v.en.start_at_text, true)) {
    m.push({
      field: "Ghi chú điểm khởi hành (EN)",
      message: mt(v.en.start_at_text, true),
    });
  }

  // thumbnail and banner
  if (!v.thumb) {
    m.push({
      field: "Hình thumbnail",
      message: REQUIRED,
    });
  }

  if (!v.banner) {
    m.push({
      field: "Hình banner",
      message: REQUIRED,
    });
  }

  // terms
  if (isEmptyDelta(v.terms.registration)) {
    m.push({
      field: "Điều kiện đăng ký",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.terms.cancellation)) {
    m.push({
      field: "Điều kiện hủy đổi",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.terms.payment)) {
    m.push({
      field: "Phương thức thanh toán",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.terms.notes)) {
    m.push({
      field: "Những điều cần lưu ý",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.terms.registration)) {
    m.push({
      field: "Điều kiện đăng ký (EN)",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.terms.cancellation)) {
    m.push({
      field: "Điều kiện hủy đổi (EN)",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.terms.payment)) {
    m.push({
      field: "Phương thức thanh toán (EN)",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.terms.notes)) {
    m.push({
      field: "Những điều cần lưu ý (EN)",
      message: REQUIRED,
    });
  }

  // price policies
  if (isEmptyDelta(v.price_policies.includes)) {
    m.push({
      field: "Giá bao gồm",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.price_policies.includes)) {
    m.push({
      field: "Giá bao gồm (EN)",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.price_policies.excludes)) {
    m.push({
      field: "Giá không bao gồm",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.price_policies.excludes)) {
    m.push({
      field: "Giá không bao gồm (EN)",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.price_policies.other)) {
    m.push({
      field: "Giá phụ thu và trẻ em",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.price_policies.other)) {
    m.push({
      field: "Giá phụ thu và trẻ em (EN)",
      message: REQUIRED,
    });
  }

  // itinerary
  if (v.itinerary.length === 0) {
    m.push({
      field: "Lộ trình",
      message: REQUIRED,
    });
  }

  if (v.itinerary.length > 0) {
    const titleErrorIndex = v.itinerary.findIndex((item) => mt(item.day));
    if (titleErrorIndex !== -1) {
      m.push({
        field: "Lộ trình",
        message: `Tiêu đề ở item thứ ${titleErrorIndex + 1}: ${mt(
          v.itinerary[titleErrorIndex].day
        )}`,
      });
    }

    const destinationsErrorIndex = v.itinerary.findIndex((item) =>
      mt(item.destination)
    );
    if (destinationsErrorIndex !== -1) {
      m.push({
        field: "Lộ trình",
        message: `Điểm đến ở item thứ ${destinationsErrorIndex + 1}: ${mt(
          v.itinerary[destinationsErrorIndex].destination
        )}`,
      });
    }

    const titleErrorIndexEN = v.en.itinerary.findIndex((item) => mt(item.day));
    if (titleErrorIndexEN !== -1) {
      m.push({
        field: "Lộ trình (EN)",
        message: `Tiêu đề ở item thứ ${titleErrorIndexEN + 1}: ${mt(
          v.en.itinerary[titleErrorIndexEN].day
        )}`,
      });
    }

    const destinationsErrorIndexEN = v.en.itinerary.findIndex((item) =>
      mt(item.destination)
    );
    if (destinationsErrorIndexEN !== -1) {
      m.push({
        field: "Lộ trình (EN)",
        message: `Điểm đến ở item thứ ${destinationsErrorIndexEN + 1}: ${mt(
          v.en.itinerary[destinationsErrorIndexEN].destination
        )}`,
      });
    }

    const missingImages = v.itinerary.every((item) => item.images.length === 0);
    if (missingImages) {
      m.push({
        field: "Lộ trình",
        message: `Thiếu hình lộ trình`,
      });
    }

    let imageCaptionError = "";
    const imageCaptionErrorIndex = v.itinerary.findIndex((item) =>
      item.images.some((img) => {
        if (mt(img.caption)) {
          imageCaptionError = mt(img.caption);
        }
        return mt(img.caption);
      })
    );

    if (imageCaptionErrorIndex !== -1) {
      m.push({
        field: "Lộ trình",
        message: `Lỗi  mô tả hình lộ trình ở item thứ ${
          imageCaptionErrorIndex + 1
        }: ${imageCaptionError}`,
      });
    }

    let imageCaptionErrorEN = "";
    const imageCaptionErrorIndexEN = v.en.itinerary.findIndex((item) =>
      item.images.some((img) => {
        if (mt(img.caption)) {
          imageCaptionErrorEN = mt(img.caption);
        }
        return mt(img.caption);
      })
    );
    if (imageCaptionErrorIndexEN !== -1) {
      m.push({
        field: "Lộ trình (EN)",
        message: `Lỗi  mô tả hình lộ trình ở item thứ ${
          imageCaptionErrorIndexEN + 1
        }: ${imageCaptionErrorEN}`,
      });
    }
  }

  if (m.length > 0) {
    errors.messages = m;
  }

  return errors;
};

export default tourValidator;
