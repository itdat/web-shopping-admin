var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Bảng điều khiển" });
});
router.get("/index.html", function(req, res, next) {
  res.render("index", { title: "Bảng điều khiển" });
});

/* GET users page. */
router.get("/users.html", function(req, res, next) {
  res.render("users", { title: "Quản lý người dùng" });
});

/* GET single user page. */
router.get("/single-user.html", function(req, res, next) {
  res.render("single-user", { title: "Thông tin người dùng" });
});

/* GET statistic page. */
router.get("/statistic.html", function(req, res, next) {
  res.render("statistic", { title: "Thống kê kinh doanh" });
});

/* GET top 10 page. */
router.get("/top-10.html", function(req, res, next) {
  res.render("top-10", { title: "Thống kê top 10" });
});

/* GET login page. */
router.get("/login.html", function(req, res, next) {
  res.render("login", { title: "Đăng nhập | Đăng ký", layout: "login" });
});

module.exports = router;
