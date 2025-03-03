const express = require('express');
const router = express.Router();
const {
  getPaymentStats,
  initiatePayment,
  verifyPayment,
} = require('../controllers/PaymentController');
const Order = require('../models/ORDERS/OrderSchema');
const Payment = require('../models/paymentSchema');
const authenticateUser = require('../middlewares/AuthMiddleware');
// Route to create a new order
// router.post('/order', createOrder);

router.post('/create-order', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;

    // Calculate total amount
    const amount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (!userId || items.length === 0 || !shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid order details' });
    }

    // ✅ **Create the order in DB**
    const order = new Order({
      userId,
      items,
      shippingAddress,
      totalAmount: amount,
      paymentMethod,
      orderStatus: 'Pending',
    });

    await order.save();

    // 📌 **Handle Cash on Delivery (COD)**
    if (paymentMethod === 'COD') {
      const payment = new Payment({
        orderId: order._id,
        userId,
        paymentStatus: 'Unpaid',
        transactionId: `COD-${Date.now()}`,
        amount,
        paymentMethod: 'COD',
      });

      await payment.save();
      return res.status(201).json({
        success: true,
        message: 'Order created successfully. COD selected.',
        order,
        payment,
      });
    }

    // 📌 **Handle Online Payment**
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise (INR)
      currency: 'INR',
      receipt: `order_${order._id}`,
      payment_capture: 1, // Auto-capture payment
    });

    res.status(201).json({
      success: true,
      message: 'Order created. Proceed with online payment.',
      order,
      razorpayOrder,
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});
router.post('/initiate', authenticateUser, initiatePayment);
// Route to verify the payment
router.post('/verify', authenticateUser, verifyPayment);
router.get('/payments-summary', getPaymentStats);

module.exports = router;
