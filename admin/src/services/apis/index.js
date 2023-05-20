// term
export { fetchTerms, updateTerms } from "./term.api.js";

// tour image
export { updateTourImages } from "./image.api.js";

// user
export {
  login,
  changeRole,
  deleteUser,
  fetchUsers,
  createUser,
  changePassword,
  resetPassword,
} from "./user.api.js";

// visa
export {
  fetchVisas,
  fetchSingleVisaProduct,
  addNewVisaProduct,
  updateVisaProduct,
  deleteVisaProduct,
  fetchVisasCategory,
  addVisasCategoryItem,
  updateVisasCategoryItem,
  deleteVisasCategoryItem,
  fetchVisaPayments,
  deleteVisaPayment,
} from "./visa.api.js";

// category
export {
  fetchCats,
  addNewCatItem,
  deleteCatItem,
  updateCatItem,
} from "./category.api.js";

// guides
export {
  fetchGuides,
  fetchSingleGuide,
  addGuide,
  updateGuide,
  deleteGuide,
  // category
  fetchGuidesCategory,
  addGuidesCategoryItem,
  updateGuidesCategoryItem,
  deleteGuidesCategoryItem,
} from "./guide.api.js";

// tour
export {
  fetchTours,
  fetchSingleTour,
  addNewTour,
  updateTour,
  deleteTour,
  updateTourItinerary,
  addRatingItem,
  updateRatingItem,
  deleteRatingItem,
  updateHotTours,
  updateSliderTours,
} from "./tour.api.js";

// slider
export { updateSliders } from "./slider.api";

// places
export {
  fetchPlaces,
  deletePlaceItem,
  updatePlaceItem,
  addPlaceItem,
} from "./place.api.js";

// company info
export { fetchCompanyInfo, updateCompanyInfo } from "./companyInfo.api";

// settings
export { fetchSettings, updateSettings } from "./settings.api";
