// controllers/WISHLIST/WishlistController.js
const Wishlist = require("../../models/WISHLIST/WishlistModel");
const AppError = require("../../utils/AppError");
const CatchAsyncErrorjs = require("../../utils/CatchAsyncErrorjs");

exports.addToWishlist = CatchAsyncErrorjs(async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // Assuming you're using middleware to attach user info

    // Check if the product is already in the wishlist
    const existingWishlistItem = await Wishlist.findOne({
      userId,
      productId,
    });
    if (existingWishlistItem) {
      return next(new AppError("Product is already in your wishlist", 400));
    }

    // Create a new wishlist item
    const wishlistItem = await Wishlist.create({ userId, productId });

    res.status(201).json({
      status: "success",
      data: {
        wishlistItem,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
});

// GET ALL WISHLIST PRODUCTS

exports.getWishlist = CatchAsyncErrorjs(async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming the user is authenticated

    // Find all wishlist items for the user and populate the product details
    const wishlistItems = await Wishlist.find({ userId }).populate("productId");

    res.status(200).json({
      status: "success",
      results: wishlistItems.length,
      data: {
        wishlistItems,
      },
    });
  } catch (error) {
    next(error);
  }
});

// REMOVE FROM WISHLIST

exports.removeFromWishlist = CatchAsyncErrorjs(async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Find and delete the product from the wishlist
    const removedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!removedItem) {
      return next(new AppError("No product found in your wishlist", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});
