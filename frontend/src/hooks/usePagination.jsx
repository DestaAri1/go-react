export function paginate(items, currentPage, itemsPerPage) {
  if (!Array.isArray(items)) {
    throw new Error("Items must be an array");
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
}

export function getTotalPages(items, itemsPerPage) {
  if (!Array.isArray(items)) {
    throw new Error("Items must be an array");
  }

  return Math.ceil(items.length / itemsPerPage);
}
