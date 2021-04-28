const ITEMS_PER_PAGE = 2;

const getPaginationData = (req, total) => {
  const { page = 1, itemsPerPage = 3 } = req.query;
  const currentPage = Number(page);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const skip = (page - 1) * itemsPerPage;
  const limit = Number(itemsPerPage);

  return {
    limit,
    skip,

    currentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage + 1,
    previousPage: currentPage > 1 ? currentPage - 1 : 1,
    lastPage: totalPages,
    firstPage: 1,
  };
};

module.exports = getPaginationData;
