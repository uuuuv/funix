const createError = require("../../helpers/errorCreator");
const Settings = require("../../models/settings.model");

module.exports.updateSettings = async (req, res, next) => {
  try {
    await Settings.updateMany({}, { $set: req.body });
    return res.status(200).json({
      message: "Thành công",
      data: req.body,
    });
  } catch (error) {
    return next(createError(error, 500));
  }
};

module.exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({
        sheetId: "",
        tourBookingSheetId: "",
        tourCallbackRequestSheetId: "",
      });
    }

    return res.status(200).json({
      data: settings,
      message: "Thành công",
    });
  } catch (error) {
    next(createError(error, 500));
  }
};
