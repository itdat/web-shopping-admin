var express = require("express");
var router = express.Router();
const { updateProfilePicture, updateProfile } = require("../controllers/admin");

router.post("/upload-image", updateProfilePicture);

router.post("/update", updateProfile);

module.exports = router;
