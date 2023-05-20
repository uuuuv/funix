const createError = require("../../helpers/errorCreator");
const { object, string } = require("yup");

module.exports = async (req, res, next) => {
  try {
    const MUST_BE_STRING = "Phải là chuỗi";
    const settingsSchema = object({
      email: string().typeError(MUST_BE_STRING).required("Thiếu email"),
      sheetId: string().typeError(MUST_BE_STRING).required("Thiếu sheetID"),
      tourBookingSheetId: string()
        .typeError(MUST_BE_STRING)
        .required("Thiếu sheetID đặt tour"),
      tourCallbackRequestSheetId: string()
        .typeError(MUST_BE_STRING)
        .required("Thiếu sheetId tư vấn tour"),
      visaBookingSheetId: string(MUST_BE_STRING).required(
        "Thiếu sheetId đặt visa"
      ),
    });

    try {
      await settingsSchema.validate(req.body);
    } catch (error) {
      return next(createError(new Error(""), 400, error.message));
    }

    return next();
  } catch (error) {
    return next(createError(error, 500));
  }
};
