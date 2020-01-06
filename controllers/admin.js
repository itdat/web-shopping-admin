const passport = require("passport");
const adminModel = require("../models/admin");

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

module.exports.updateProfilePicture = (req, res) => {
  console.log(req.body.profilePicture);
  if (adminModel.updateProfilePicture(req.body.profilePicture)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};

module.exports.updateProfile = (req, res) => {
  console.log("Data recieved: ", req.body);
  if (adminModel.updateProfile(req.body)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};
