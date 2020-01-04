var express = require("express");
var router = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  updateSingleProduct
} = require("../controllers/product");

// Middlewares to validate data sent to server
const { isValidID } = require("../models/product");

router.get("/", getAllProducts);

router.get("/:path", getSingleProduct);

// router.post("/create/:id", createSingleProduct);

router.post("/update/:id", isValidID, updateSingleProduct);

// router.post("/delete/:id", deleteSingleProduct);

module.exports = router;
