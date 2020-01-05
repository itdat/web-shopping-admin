var express = require("express");
var router = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  updateSingleProduct,
  createNewProduct,
  deleteProduct
} = require("../controllers/product");

// Middlewares to validate data sent to server
const { isValidID } = require("../models/product");

router.get("/", getAllProducts);

router.get("/:path", getSingleProduct);

router.post("/create", createNewProduct);

router.post("/update/:id", isValidID, updateSingleProduct);

router.post("/delete/:id", isValidID, deleteProduct);

module.exports = router;
