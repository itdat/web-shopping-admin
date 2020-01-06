const express = require("express");

const index = require("./routes/index");
const login = require("./routes/login");
const logout = require("./routes/logout");
const products = require("./routes/products");
const users = require("./routes/users");
const profile = require("./routes/profile");

const {
  isAuthenticated,
  isUnauthenticated
} = require("./controllers/authentication");

const router = express.Router();

router.use("/login", isUnauthenticated, login);

router.use("/", isAuthenticated);

router.use("/", index);

router.use("/products", products);

router.use("/users", users);

router.use("/profile", profile);

router.use("/logout", logout);

module.exports = router;
