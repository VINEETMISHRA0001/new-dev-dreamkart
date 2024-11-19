const express = require("express");
const authenticateUser = require("../../middlewares/AuthMiddleware");
const {
  AddToRecentlyViewed,
  getRecentlyViewed,
} = require("../../controllers/RECENTLY VIEWED/RecentlyViewed");

const router = express.Router();

router.get("/:userId", authenticateUser, getRecentlyViewed);
// Route for creating a product with image upload
router.post("/add", authenticateUser, AddToRecentlyViewed); // Protecting the route and handling file upload

module.exports = router;
