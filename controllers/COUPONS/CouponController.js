// controllers/COUPON/CouponController.js
const Coupon = require("../../models/COUPONS/CouponModel");
const CatchAsyncErrorjs = require("../../utils/CatchAsyncErrorjs");
const AppError = require("../../utils/AppError");

// Admin: Create a coupon
exports.createCoupon = CatchAsyncErrorjs(async (req, res, next) => {
  try {
    const { name, discount, expiresAt } = req.body;

    // Check if a coupon with the same name already exists
    const existingCoupon = await Coupon.findOne({ name });
    if (existingCoupon) {
      return next(new AppError("Coupon with this name already exists", 400));
    }

    const coupon = await Coupon.create({
      name,
      discount,
      expiresAt,
    });

    res.status(201).json({
      status: "success",
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Aplly Coupon
exports.applyCoupon = CatchAsyncErrorjs(async (req, res, next) => {
  try {
    const { couponCode, productPrice } = req.body;

    // Find the coupon by its name and check if it's active and not expired
    const coupon = await Coupon.findOne({
      name: couponCode,
      isActive: true,
      expiresAt: { $gt: Date.now() },
    });

    if (!coupon) {
      return next(new AppError("Coupon is invalid or expired", 400));
    }

    // Calculate the discounted price
    const discountAmount = (productPrice * coupon.discount) / 100;
    const discountedPrice = productPrice - discountAmount;

    res.status(200).json({
      status: "success",
      data: {
        originalPrice: productPrice,
        discountedPrice,
        discount: coupon.discount,
      },
    });
  } catch (error) {
    next(error);
  }
});
