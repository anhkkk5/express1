const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system.js");
const generate = require("../../helpers/generate");
const md5 = require("md5");

//[Get] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token -avatar");
  console.log(records);
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    }).select("title");
    record.role = role || { title: record.role_id };
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: " Nhóm danh sách tài  khoản",
    records: records,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};

//[Get] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: " tạo mới tài khoản",
    roles: roles,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    // Nếu res.redirect("back") không hoạt động, chuyển hướng về trang tạo mới tài khoản
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    req.flash("success", "Tạo tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Account.findOne({ _id: id, deleted: false }).select(
      "-password -token"
    );
    if (!record) {
      req.flash("error", "Tài khoản không tồn tại");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    const role = await Role.findOne({ _id: record.role_id, deleted: false });
    res.render("admin/pages/accounts/detail", {
      pageTitle: "Chi tiết tài khoản",
      record,
      role,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    req.flash("error", "Không lấy được chi tiết tài khoản");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Account.findOne({ _id: id, deleted: false }).select(
      "-password -token"
    );
    if (!record) {
      req.flash("error", "Tài khoản không tồn tại");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Cập nhật tài khoản",
      record,
      roles,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    req.flash("error", "Không lấy được thông tin tài khoản");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const update = { ...req.body };
    if (update.password) {
      update.password = md5(update.password);
    }
    await Account.updateOne({ _id: id }, update);
    req.flash("success", "Cập nhật tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash("error", "Cập nhật tài khoản thất bại");
    res.redirect("back");
  }
};

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteSoft = async (req, res) => {
  try {
    const id = req.params.id;
    await Account.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    req.flash("success", "Xóa tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash("error", "Xóa tài khoản thất bại");
    res.redirect("back");
  }
};
