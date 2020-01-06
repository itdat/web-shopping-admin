const express = require("express");
const router = express.Router();
const { logoutAdmin } = require("../controllers/admin");

router.get("/", logoutAdmin);

module.exports = router;
