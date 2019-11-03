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

module.exports = router;
