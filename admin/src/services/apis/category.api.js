export const fetchCats = () => ({
  method: "GET",
  url: "/admin/categories",
});

export const addNewCatItem = (data) => ({
  method: "POST",
  url: "/admin/categories",
  data,
});

export const deleteCatItem = (catId) => ({
  method: "DELETE",
  url: "/admin/categories",
  data: { catId },
});

export const updateCatItem = (data) => ({
  method: "PUT",
  url: "/admin/categories",
  data,
});
