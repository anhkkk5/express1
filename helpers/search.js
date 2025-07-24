module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  };

  // Kiểm tra và làm sạch keyword
  if (query.keyword && query.keyword.trim()) {
    objectSearch.keyword = query.keyword.trim();

    // Tạo regex với flag 'i' để không phân biệt hoa thường
    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regex = regex;

    console.log("Search keyword:", objectSearch.keyword); // Debug log
  }

  return objectSearch;
};
