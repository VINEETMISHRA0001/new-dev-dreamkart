const express = require("express");
const {
  addToCart,
  deleteProductFromCart,
  getAllCartItems,
  calculateCartTotal,
} = require("./../../controllers/CART/CartController");
const authenticateUser = require("./../../middlewares/AuthMiddleware");

const router = express.Router();

// POST request to add products to the cart
router.get("/cart", authenticateUser, getAllCartItems);
router.post("/add-to-cart", authenticateUser, addToCart);
router.get("/cart/total", authenticateUser, calculateCartTotal);
router.delete("/remove/:cartItemId", authenticateUser, deleteProductFromCart);

module.exports = router;
