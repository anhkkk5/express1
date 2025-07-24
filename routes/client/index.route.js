const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");

module.exports = (app) => {
  app.use("/", homeRoutes); // Trang chủ dùng /
  app.use("/products", productRoutes); // Các trang sản phẩm dùng /products
};
