const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/account.controller");
const multer = require("multer");
const validate = require("../../valiuedates/admin/accounts.valuedates");
router.get("/", controller.index);
router.get("/create", controller.create);
const upload = multer();
const uploadtCloud = require("../../middlewares/admin/uploadtCloud.middlewares");
router.post(
  "/create",
  upload.single("avatar"),
  uploadtCloud.uploadtCloud,
  validate.createPost,
  controller.createPost
);

// Detail
router.get("/detail/:id", controller.detail);

// Edit
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadtCloud.uploadtCloud,
  controller.editPatch
);

// Delete (soft)
router.delete("/delete/:id", controller.deleteSoft);

module.exports = router;
