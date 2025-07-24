//[get] /products
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).lean();

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });
  console.log(newProducts);
  res.render("client/pages/products/index", {
    pageTitle: "danh sách sản phẩm",
    products: products,
  });
};

//[get] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      status: "active",
      deleted: false,
      slug: req.params.slug,
    };
    const product = await Product.findOne(find);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.redirect(`${prefixClient}/products`);
  }
};
