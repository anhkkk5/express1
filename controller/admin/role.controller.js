const Role = require("../../models/role.model");
const systemConfig = require("../../config/system.js");
//[Get] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: " Nhóm quyền",
    records: records,
  });
};
//[Get] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo Nhóm quyền",
  });
};
//[Post] /admin/roles/create
module.exports.createPost = async (req, res) => {
  console.log(req.body);
  // lưu thông tin vào data

  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

//[Get] /admin/roles/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false,
    };

    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Tạo Nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
//[Patch] /admin/roles/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật nhóm quyền thành công");
    // Chuyển hướng về trang danh sách để hiển thị flash message
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Cập nhật nhóm quyền thất bại");
    res.redirect("back");
  }
};
