const systemConfig = require("../../config/system");

module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập tên");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mk");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    return;
  }

  next();
};
