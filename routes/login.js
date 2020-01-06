var express = require("express");
var router = express.Router();
const { showLoginPage, loginAdmin } = require("../controllers/admin");

router.get("/", showLoginPage);
router.post("/", loginAdmin);

module.exports = router;
