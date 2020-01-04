const productModel = require("../models/product");

module.exports.getAllProducts = async (req, res) => {
  try {
    // Get data from database
    const allProducts = await productModel.getProductsByQueryObject(req.query);

    const limit = 10;
    const pageCount = Math.ceil(allProducts.totalItems / limit);
    const pageRange = 3;
    const currentPage = Number(req.query.page) || 1;
    const startIndex =
      allProducts.data.length > 0 ? (currentPage - 1) * limit + 1 : 0;
    const endIndex =
      allProducts.data.length > 0
        ? startIndex + allProducts.data.length - 1
        : 0;
    const totalItems = allProducts.data.length > 0 ? allProducts.totalItems : 0;

    let path = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    path.searchParams.delete("page");
    path = path.toString();

    // Create view model to response
    let viewModel = {
      title: "Danh sách sản phẩm",
      layout: "layout",
      pageCount,
      currentPage,
      pageRange,
      path,
      startIndex,
      endIndex,
      totalItems,
      allProducts: allProducts.data,
      appleNumber: await productModel.countProductsByBrand("Apple"),
      samsungNumber: await productModel.countProductsByBrand("Samsung"),
      asusNumber: await productModel.countProductsByBrand("Asus"),
      nokiaNumber: await productModel.countProductsByBrand("Nokia"),
      huaweiNumber: await productModel.countProductsByBrand("Huawei"),
      oppoNumber: await productModel.countProductsByBrand("OPPO"),
      sonyNumber: await productModel.countProductsByBrand("Sony"),
      lenovoNumber: await productModel.countProductsByBrand("Lenovo"),
      xiaomiNumber: await productModel.countProductsByBrand("Xiaomi"),
      realmeNumber: await productModel.countProductsByBrand("Realme"),
      blackberryNumber: await productModel.countProductsByBrand("BlackBerry")
    };

    // Response
    res.status(200);
    return res.render("products", viewModel);
  } catch (err) {
    // Show error message
    console.log("ERROR MESSAGE:\n" + err.message);

    // Response error code 500
    res.status(500);
    return res.render("error", {
      code: 500,
      title: "Lỗi truy xuất dữ liệu",
      details:
        "Có lỗi xảy ra ở server nên tạm thời yêu cầu không được phản hồi!"
    });
  }
};

module.exports.getSingleProduct = async (req, res) => {
  try {
    // Get data from database
    const productDetails = await productModel.getProductDetails(
      req.params.path
    );

    // Create view model
    let viewModel = {
      title: productDetails.name,
      productDetails
    };

    // Response
    res.status(200);
    console.log(viewModel);
    res.render("products", viewModel);
  } catch (err) {
    console.log("ERROR MESSAGE:\n" + err.message);
    res.status(500);
    return res.render("error", {
      code: 500,
      title: "Lỗi truy xuất dữ liệu",
      details:
        "Có lỗi xảy ra ở server nên tạm thời yêu cầu không được phản hồi!"
    });
  }
};

module.exports.updateSingleProduct = async (req, res) => {
  productModel.updateProductDetails(Number(req.params.id), req.body);
  res.sendStatus(200);
};
