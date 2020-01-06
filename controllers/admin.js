const passport = require("passport");

module.exports.showLoginPage = (req, res) => {
  res.render("login", {
    title: "Đăng nhập",
    layout: "layout-login",
    error: req.flash("error")
  });
};

module.exports.loginAdmin = passport.authenticate("local.login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
});

module.exports.logoutAdmin = (req, res) => {
  req.logout();
  res.redirect("/");
};
