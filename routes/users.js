var express = require("express");
var router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  changeUserStatus
} = require("../controllers/users");

/* GET users listing. */
router.get("/", getAllUsers);

router.get("/:id", getUserDetails);

router.post("/change-status/:id", changeUserStatus);

module.exports = router;
