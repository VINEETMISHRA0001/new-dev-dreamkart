// routes/WISHLIST/WishlistRoutes.js
const express = require("express");
const authenticateUser = require("../../middlewares/AuthMiddleware");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../../controllers/WISHLIST/WishlistController");

const router = express.Router();

// Route to add product to wishlist
router.post("/add", authenticateUser, addToWishlist);
router.get("/all", authenticateUser, getWishlist);
router.delete("/remove/:productId", authenticateUser, removeFromWishlist);

module.exports = router;
