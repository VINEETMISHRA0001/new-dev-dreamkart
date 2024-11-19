// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Coupon must have a name"],
    unique: true,
  },
  discount: {
    type: Number,
    required: [true, "Coupon must have a discount value"],
    min: [1, "Discount must be at least 1%"],
    max: [100, "Discount cannot exceed 100%"],
  },
  expiresAt: {
    type: Date,
    required: [true, "Coupon must have an expiration date"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
