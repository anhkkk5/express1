module.exports = (objPagination, query, coutProduct) => {
  if (query.page) {
    objPagination.currentPage = parseInt(query.page);
  }
  objPagination.skip =
    (objPagination.currentPage - 1) * objPagination.limitItem;

  totalPage = Math.ceil(coutProduct / objPagination.limitItem);
  objPagination.totalPage = totalPage;
  return objPagination;
};
