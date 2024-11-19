// models/Coupon.js

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

couponSchema.methods.isExpired = function () {
  return new Date() > this.expirationDate;
};

module.exports = mongoose.model('Discount', couponSchema);
