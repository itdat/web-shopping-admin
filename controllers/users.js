const userModel = require("../models/user");

module.exports.getAllUsers = async (req, res) => {
  try {
    // Get data from database
    const allUsers = await userModel.getAllUsers(req.query);

    const limit = 10;
    const pageCount = Math.ceil(allUsers.totalItems / limit);
    const pageRange = 3;
    const currentPage = Number(req.query.page) || 1;
    const startIndex =
      allUsers.data.length > 0 ? (currentPage - 1) * limit + 1 : 0;
    const endIndex =
      allUsers.data.length > 0 ? startIndex + allUsers.data.length - 1 : 0;
    const totalItems = allUsers.data.length > 0 ? allUsers.totalItems : 0;

    let path = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    path.searchParams.delete("page");
    path = path.toString();

    // Create view model to response
    let viewModel = {
      title: "Quản lý người dùng",
      pageCount,
      currentPage,
      pageRange,
      path,
      startIndex,
      endIndex,
      totalItems,
      allUsers: allUsers.data
    };

    console.log(viewModel);

    // Response
    res.status(200);
    return res.render("users", viewModel);
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

module.exports.getUserDetails = async (req, res) => {
  try {
    // Get data from database
    const userDetails = await userModel.getUserDetails(req.params.id);

    // Create view model
    let viewModel = {
      userDetails
    };

    // Response
    res.status(200);
    console.log(viewModel);
    res.render("users", viewModel);
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

module.exports.changeUserStatus = async (req, res) => {
  let result = await userModel.changeUserStatus(Number(req.params.id));
  if (result) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};
