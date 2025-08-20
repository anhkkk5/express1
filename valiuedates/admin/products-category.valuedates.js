const systemConfig = require("../../config/system");

module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tên danh mục");
    res.redirect(`${systemConfig.prefixAdmin}/products-category/create`);
    return;
  }

  next();
};
