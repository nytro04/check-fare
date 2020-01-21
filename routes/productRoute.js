const express = require("express");
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("./../controllers/productController");

const { protect, restrictTo } = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, restrictTo, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(protect, restrictTo, deleteProduct);

module.exports = router;
