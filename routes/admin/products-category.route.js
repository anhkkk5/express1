const express = require("express");
const router = express.Router();
const validate = require("../../valiuedates/admin/products-category.valuedates");
const controller = require("../../controller/admin/products-category.controller.js");
const multer = require("multer");
const uploadtCloud = require("../../middlewares/admin/uploadtCloud.middlewares");
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadtCloud.uploadtCloud,
  validate.createPost,
  controller.createPost
);
router.patch("/change-multi", controller.changeMulti);
router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadtCloud.uploadtCloud,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
