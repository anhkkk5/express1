const { default: mongoose } = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", // Tạo slug từ trường title
    },
    deleted: {
      type: Boolean,
      default: false, // Mặc định là không bị xóa
    },
    stock: Number,
    thumbnail: String,
    deletedAt: Date,
  },
  {
    timestamps: true, // Tạo 2 trường createdAt và updatedAt
  }
);

const Product = mongoose.model(`Product`, productSchema, "products");

module.exports = Product;
