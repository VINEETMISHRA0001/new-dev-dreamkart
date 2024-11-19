// routes/COUPON/CouponRoutes.js
const express = require("express");
const {
  authenticateAdmin,
} = require("../../middlewares/Admin/AuthenticateAdmin");
const {
  createCoupon,
  applyCoupon,
} = require("../../controllers/COUPONS/CouponController");
const authenticateUser = require("../../middlewares/AuthMiddleware");

const router = express.Router();

// Admin: Create a coupon
router.post("/create", authenticateAdmin, createCoupon);

// User: Apply a coupon
router.post("/apply", authenticateUser, applyCoupon);

module.exports = router;
