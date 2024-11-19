const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require('../controllers/PaymentController');

// Route to create a new order
router.post('/order', createOrder);

// Route to verify the payment
router.post('/verify', verifyPayment);

module.exports = router;
