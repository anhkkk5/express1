const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search.js");
const getFilterStatus = require("../../helpers/filterStatus.js"); // Đổi tên import
const getPagination = require("../../helpers/pagination.js");
const createTreeHelper = require("../../helpers/createTreeHelper.js");
//[Get] /admin/products-category
module.exports.index = async (req, res) => {
  let find = { deleted: false };

  const records = await ProductCategory.find(find);
  const tree = createTreeHelper.tree(records);
  // Lấy trạng thái lọc từ helper
  const filterStatus = getFilterStatus(req.query);

  // Áp dụng filter status vào query
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm theo từ khóa
  const search = searchHelper(req.query);
  if (search.regex) {
    find.title = { $regex: search.regex };
  }

  // Pagination
  const countProductCategory = await ProductCategory.countDocuments(find);
  let objPagination = getPagination(
    {
      currentPage: 1,
      limitItem: 6,
    },
    req.query,
    countProductCategory
  );

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  try {
    const records = await ProductCategory.find(find)
      .sort(sort)
      .limit(objPagination.limitItem)
      .skip(objPagination.skip);

    res.render("admin/pages/products-category/index", {
      pageTitle: "Danh mục sản phẩm",
      records: tree,
      filterStatus,
      keyword: search.keyword || "",
      pagination: objPagination,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error("Error finding product categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

//[Get] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const tree = createTreeHelper.tree(records);
  console.log(tree);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: tree,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
//[Post] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  try {
    if (!req.body.position || isNaN(parseInt(req.body.position))) {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    // Tạo record mới
    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Tạo danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    req.flash("error", "Tạo danh mục thất bại!");
    res.redirect("back");
  }
};
//[Patch] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
      case "active":
        await ProductCategory.updateMany(
          { _id: { $in: ids }, deleted: false },
          { status: "active" }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công (${ids.length} danh mục)`
        );
        break;

      case "inactive":
        await ProductCategory.updateMany(
          { _id: { $in: ids }, deleted: false },
          { status: "inactive" }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công (${ids.length} danh mục)`
        );
        break;

      case "delete-all":
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        req.flash("success", `Xóa thành công (${ids.length} danh mục)`);
        break;

      case "swap-position":
        const positions = req.body.positions.split(",");

        if (ids.length !== positions.length) {
          console.error("Mảng ids và positions không khớp nhau");
          req.flash("error", "Dữ liệu không hợp lệ");
          return res.redirect(
            `/admin/products-category?page=${req.body.page || 1}`
          );
        }

        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          const position = parseInt(positions[i]);

          if (isNaN(position)) {
            console.error(`Vị trí không hợp lệ cho id ${id}`);
            continue;
          }

          await ProductCategory.updateOne(
            { _id: id, deleted: false },
            { position: position }
          );
          console.log(`Đã cập nhật vị trí: ${id} -> ${position}`);
        }
        req.flash("success", "Cập nhật vị trí thành công");
        break;

      default:
        console.error("Loại thao tác không hợp lệ:", type);
        req.flash("error", "Loại thao tác không hợp lệ");
    }

    const page = req.body.page || 1;
    res.redirect(`/admin/products-category?page=${page}`);
  } catch (error) {
    console.error("Lỗi trong changeMulti:", error);
    req.flash("error", "Có lỗi xảy ra khi thực hiện thao tác");
    res.redirect("/admin/products-category");
  }
};
//[Get] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  try {
    await ProductCategory.updateOne(
      { _id: id, deleted: false },
      { status: status }
    );
    req.flash("success", "Cập nhật trạng thái thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    req.flash("error", "Lỗi khi cập nhật trạng thái");
  }

  const query = new URLSearchParams(req.query).toString();
  res.redirect(`/admin/products-category?${query}`);
};

//[Get] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    const records = await ProductCategory.find({
      deleted: false,
    });
    console.log(records);
    const tree = createTreeHelper.tree(records);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Sửa danh mục sản phẩm",
      data: data,
      records: tree,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    res.redirect("/admin/products-category");
  }
};
//[Patch] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật danh mục thành công!");
    res.redirect(`/admin/products-category/edit/${id}`);
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    req.flash("error", "Cập nhật danh mục thất bại!");
    res.redirect(`/admin/products-category/edit/${id}`);
  }
};

//[Delete] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    // Kiểm tra xem danh mục có sản phẩm con không
    const hasChildren = await ProductCategory.findOne({
      parent_id: id,
      deleted: false,
    });

    if (hasChildren) {
      req.flash("error", "Không thể xóa danh mục có danh mục con!");
      // Nếu là request từ fetch/ajax → trả JSON thay vì redirect
      const isAjax =
        req.xhr ||
        req.headers["x-requested-with"] === "XMLHttpRequest" ||
        (req.headers.accept &&
          req.headers.accept.includes("application/json")) ||
        (req.headers["content-type"] &&
          req.headers["content-type"].includes("application/json"));

      if (isAjax) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Không thể xóa danh mục có danh mục con!",
          });
      }
      return res.redirect("/admin/products-category");
    }

    // Xóa mềm danh mục
    await ProductCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    req.flash("success", "Xóa danh mục thành công");
    // Nếu là request từ fetch/ajax → trả JSON thay vì redirect
    const isAjax =
      req.xhr ||
      req.headers["x-requested-with"] === "XMLHttpRequest" ||
      (req.headers.accept && req.headers.accept.includes("application/json")) ||
      (req.headers["content-type"] &&
        req.headers["content-type"].includes("application/json"));

    if (isAjax) {
      return res
        .status(200)
        .json({ success: true, message: "Xóa danh mục thành công" });
    }
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    req.flash("error", "Lỗi khi xóa danh mục");
    const isAjax =
      req.xhr ||
      req.headers["x-requested-with"] === "XMLHttpRequest" ||
      (req.headers.accept && req.headers.accept.includes("application/json")) ||
      (req.headers["content-type"] &&
        req.headers["content-type"].includes("application/json"));
    if (isAjax) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khi xóa danh mục" });
    }
  }

  res.redirect("/admin/products-category");
};

//[Get] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    if (!category) {
      req.flash("error", "Danh mục không tồn tại");
      return res.redirect("/admin/products-category");
    }

    // Lấy danh mục cha nếu có
    let parentCategory = null;
    if (category.parent_id) {
      parentCategory = await ProductCategory.findOne({
        _id: category.parent_id,
        deleted: false,
      });
    }

    // Lấy danh mục con nếu có
    const childCategories = await ProductCategory.find({
      parent_id: id,
      deleted: false,
    });

    res.render("admin/pages/products-category/detail", {
      pageTitle: `Chi tiết: ${category.title}`,
      category: category,
      parentCategory: parentCategory,
      childCategories: childCategories,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết danh mục:", error);
    req.flash("error", "Lỗi khi lấy chi tiết danh mục");
    res.redirect("/admin/products-category");
  }
};
