const express = require('express');
const router = express.Router();
const couponController = require('../controllers/DiscountController');
const Coupon = require('../models/DiscountModel');

// Add this route in `adminRoutes.js` (backend)

router.get('/get-discount', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-discount', couponController.createCoupon);
// Route for applying a coupon
router.post('/apply-discount', couponController.applyCoupon);

module.exports = router;
