import {
  mediumTextValidator as mt,
  slugValidator,
} from "../../../services/helpers/validator.helper";

const isEmptyDelta = (delta) => {
  if (!delta) return true;

  const ops = delta.ops;
  return ops.length === 1 && !Boolean(ops[0].insert.trim());
};

export default (v) => {
  const errors = {};
  let m = [];
  const REQUIRED = "Bắt buộc";

  // title
  if (mt(v.title)) {
    m.push({
      field: "Tiêu đề",
      message: mt(v.title),
    });
  }

  if (mt(v.en.title)) {
    m.push({
      field: "Tiêu đề (EN)",
      message: mt(v.en.title),
    });
  }

  // slug
  if (slugValidator(v.slug)) {
    m.push({
      field: "Slug",
      message: slugValidator(v.slug),
    });
  }

  if (mt(v.author)) {
    m.push({
      field: "Tác giả",
      message: mt(v.author),
    });
  }

  if (mt(v.origin, true)) {
    m.push({
      field: "Nguồn bài viết",
      message: mt(v.origin, true),
    });
  }

  if (!v.category) {
    m.push({
      field: "Danh mục",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.content)) {
    m.push({
      field: "Nội dung",
      message: REQUIRED,
    });
  }

  if (isEmptyDelta(v.en.content)) {
    m.push({
      field: "Nội dung (EN)",
      message: REQUIRED,
    });
  }

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

  if (m.length > 0) {
    errors.messages = m;
  }

  return errors;
};
