const { default: mongoose } = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: "",
    },
    description: String,
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

    thumbnail: String,
    deletedAt: Date,
  },
  {
    timestamps: true, // Tạo 2 trường createdAt và updatedAt
  }
);

const ProductCategory = mongoose.model(
  `ProductCategory`,
  productCategorySchema,
  "products-category"
);

module.exports = ProductCategory;
