const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productsCategoryRoutes = require("./products-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./accounts.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes); // Trang chủ dùng /
  app.use(PATH_ADMIN + "/products", productRoutes); // Trang sản phẩm dùng /admin/product
  app.use(PATH_ADMIN + "/products-category", productsCategoryRoutes); // Trang danh mục sản phẩm dùng /admin/products-category
  app.use(PATH_ADMIN + "/roles", roleRoutes); // Trang phaan quyeenf /
  app.use(PATH_ADMIN + "/accounts", accountRoutes); // Trang quản lý tài khoản /
};
