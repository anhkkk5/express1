const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,

    description: String,
    permissions: {
      type: Array,
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false, // Mặc định là không bị xóa
    },

    deletedAt: Date,
  },
  {
    timestamps: true, // Tạo 2 trường createdAt và updatedAt
  }
);

const Role = mongoose.model(`Role`, roleSchema, "roles");

module.exports = Role;
