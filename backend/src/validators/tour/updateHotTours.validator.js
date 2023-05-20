const createError = require("../../helpers/errorCreator");
const Tour = require("../../models/tour.model");

module.exports = async (req, res, next) => {
  try {
    const { tourIds } = req.body;
    if (!tourIds) {
      return next(createError(new Error(""), 400, `thiếu tourIds`));
    }

    const tours = await Tour.find({ _id: { $in: tourIds } });
    const notExistId = tourIds.find(
      (tourId) => !tours.find((tour) => tour._id.toString() === tourId)
    );
    if (notExistId) {
      return next(
        createError(new Error(""), 400, `Không tìm thấy tour id: ${notExistId}`)
      );
    }

    return next();
  } catch (error) {
    return next(createError(error, 500));
  }
};
