const Product = require("../../models/product.model");
const searchHelper = require("../../helpers/search.js");
const getFilterStatus = require("../../helpers/filterStatus.js"); // Đổi tên import
const getPagination = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js");
const createTreeHelper = require("../../helpers/createTreeHelper.js");
const ProductCategory = require("../../models/product-category.model");
// [Get] /admin/products
module.exports.index = async (req, res) => {
  let find = { deleted: false };

  // Lấy trạng thái lọc từ helper
  const filterStatus = getFilterStatus(req.query); // Sử dụng tên khác

  // Áp dụng filter status vào query
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm theo từ khóa
  const search = searchHelper(req.query);

  if (search.regex) {
    find.title = { $regex: search.regex };
  }
  //pagination
  coutProduct = await Product.countDocuments(find); // số lương sản phẩm
  let objPagination = getPagination(
    {
      currentPage: 1,
      limitItem: 6,
    },
    req.query,
    coutProduct
  );

  //end pagination
  //sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  //end sort
  try {
    const products = await Product.find(find)

      .sort(sort) // Sắp xếp
      .limit(objPagination.limitItem)
      .skip(objPagination.skip);

    console.log("Found products:", products.length);
    console.log("Final find query:", find);

    res.render("admin/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products,
      filterStatus,
      keyword: search.keyword || "",
      pagination: objPagination,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error("Error finding products:", error);
    res.status(500).send("Internal Server Error");
  }
};

// [Get] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  try {
    await Product.updateOne({ _id: id, deleted: false }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    req.flash("error", "Lỗi khi cập nhật trạng thái");
  }

  const query = new URLSearchParams(req.query).toString();
  res.redirect(`/admin/products?${query}`);
};

// [Get] /admin/products/change-mutil/:status/:id
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(","); // Mảng chứa các ID sản phẩm

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids }, deleted: false },
        { status: "active" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công  (${ids.length} sản phẩm)`
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids }, deleted: false },
        { status: "inactive" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công  (${ids.length} sản phẩm)`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true, // Cập nhật trạng thái xóa mềm
          deletedAt: new Date(), // Ghi lại thời gian xóa
        }
      );
      req.flash("success", `Xóa thành công (${ids.length} sản phẩm)`);
      break;
    case "swap-position":
      const positions = req.body.positions.split(","); // giữ lại

      if (ids.length !== positions.length) {
        console.error("Mảng ids và positions không khớp nhau");
        return res.redirect(`/admin/products?page=${req.body.page || 1}`);
      }

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const position = parseInt(positions[i]);

        if (isNaN(position)) {
          console.error(`Giá trị position không hợp lệ cho id ${id}`);
          continue;
        }

        await Product.updateOne(
          { _id: id, deleted: false },
          { position: position }
        );
        console.log(`Đã cập nhật ${id} -> vị trí ${position}`);
      }
      break;

    default:
      console.error("Unknown action type:", type);
  }

  // Redirect về trang hiện tại
  const page = req.body.page || 1;
  res.redirect(`/admin/products?page=${page}`);
};

// [Delete] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id }, // Chỉ cập nhật nếu sản phẩm không bị xóa
    // xóa mềm
    { deleted: true, deletedAt: new Date() } // Cập nhật trạng thái xóa mềm
  );
  req.flash("success", "Xóa sản phẩm thành công");
  const query = new URLSearchParams(req.query).toString();
  res.redirect(`/admin/products?${query}`);
};
// [Get] /admin/products/create
module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    const category = await ProductCategory.find(find);
    console.log("Raw categories found:", category);

    const newCategory = createTreeHelper.tree(category);
    console.log("Categories found:", category.length);
    console.log("Tree structure:", JSON.stringify(newCategory, null, 2));

    res.render("admin/pages/products/create", {
      pageTitle: "Thêm mới sản phẩm",
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
      category: newCategory,
    });
  } catch (error) {
    console.error("Error in create method:", error);
    res.status(500).send("Internal Server Error");
  }
};
//[Post] /admin/products/create
module.exports.createPost = async (req, res) => {
  console.log(req.file);
  req.body.price = parseFloat(req.body.price) || 0;
  req.body.discountPercentage = parseFloat(req.body.discountPercentage) || 0;
  req.body.stock = parseInt(req.body.stock) || 0;

  // Xử lý position đúng cách
  if (!req.body.position || isNaN(parseInt(req.body.position))) {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
// [Get] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  console.log(req.params.id);

  // Tạo riêng find cho product
  const productFind = {
    deleted: false,
    _id: req.params.id,
  };

  // Tạo riêng find cho category (giống như trong method create)
  const categoryFind = {
    deleted: false,
  };

  const category = await ProductCategory.find(categoryFind);
  const newCategory = createTreeHelper.tree(category);

  const product = await Product.findOne(productFind);
  console.log(product);

  if (!product) {
    req.flash("error", "Sản phẩm không tồn tại");
    return res.redirect(`${systemConfig.prefixAdmin}/products`);
  }

  res.render("admin/pages/products/edit", {
    pageTitle: "Sửa sản phẩm",
    product: product,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
    category: newCategory,
  });
};
// [Patch] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseFloat(req.body.price) || 0;
  req.body.discountPercentage = parseFloat(req.body.discountPercentage) || 0;
  req.body.stock = parseInt(req.body.stock) || 0;
  req.body.position = parseInt(req.body.position) || 0;
  if (req.file) {
    req.body.thumbnail = `uploads/${req.file.filename}`;
  }
  try {
    await Product.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cập nhập sản phẩm thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhập sản phẩm:", error);
    req.flash("error", "Lỗi khi cập nhập sản phẩm");
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [Get] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const product = await Product.findOne(find);
  console.log(product);
  if (!product) {
    req.flash("error", "Sản phẩm không tồn tại");
    return res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
  res.render("admin/pages/products/detail", {
    pageTitle: product.title,
    product: product,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
