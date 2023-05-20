export const getOrder = (page, pageSize, index) => {
  return (page - 1) * pageSize + index + 1;
};

export const getPaginatedItems = (page, pageSize, allItems) =>
  allItems.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

export const getTotalPage = (items, pageSize) =>
  Math.ceil(items.length / pageSize);
