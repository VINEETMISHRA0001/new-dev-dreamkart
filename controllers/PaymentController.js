const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Log keys to verify they are loaded correctly (for debugging purposes)
console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET);

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Public
exports.createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    const options = {
      amount: parseInt(amount) * 100, // Amount in the smallest currency unit (e.g., paise for INR)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    // Create order in Razorpay
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Public
exports.verifyPayment = (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  try {
    // Generate the expected signature using Razorpay secret
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    // Compare the received signature with the generated one
    if (generatedSignature === signature) {
      res
        .status(200)
        .json({ success: true, message: 'Payment verified successfully' });
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Payment verification failed' });
  }
};
