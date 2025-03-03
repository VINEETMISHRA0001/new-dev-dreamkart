require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/ORDERS/OrderSchema'); // Import your Order model

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// const Order = require('../models/ORDERS/OrderSchema'); // Order schema
const Payment = require('../models/paymentSchema');
// Payment schema

// exports.verifyPayment = async (req, res) => {
//   const { orderId, paymentStatus, transactionId, amount, paymentMethod } =
//     req.body;

//   try {
//     // 1️⃣ **Find the order by orderId**
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Order not found' });
//     }

//     // 2️⃣ **Check if a payment record already exists for this order**
//     let payment = await Payment.findOne({ orderId });

//     if (payment) {
//       // **Update existing payment record**
//       payment.paymentStatus = paymentStatus ? 'Paid' : 'Unpaid';
//       payment.transactionId = transactionId || payment.transactionId;
//       payment.amount = amount || payment.amount;
//       payment.paymentMethod = paymentMethod || payment.paymentMethod;
//     } else {
//       // **Create a new payment record**
//       payment = new Payment({
//         orderId,
//         userId: order.userId, // Associate payment with user
//         paymentStatus: paymentStatus ? 'Paid' : 'Unpaid',
//         transactionId,
//         amount,
//         paymentMethod,
//       });
//     }

//     // 3️⃣ **Save payment record**
//     await payment.save();

//     // 4️⃣ **Update Order Status to "Paid" if payment is successful**
//     if (paymentStatus) {
//       order.status = 'Paid';
//       await order.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: `Payment recorded & Order updated to ${order.status}`,
//       payment,
//     });
//   } catch (error) {
//     console.error('Payment Verification Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Payment verification failed',
//       error: error.message,
//     });
//   }
// };

exports.initiatePayment = async (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (paymentMethod === 'COD') {
      // Handle COD Payment
      let payment = await Payment.findOne({ orderId });

      if (payment) {
        payment.paymentStatus = 'Unpaid';
        payment.amount = amount || payment.amount;
        payment.paymentMethod = 'COD';
      } else {
        payment = new Payment({
          orderId,
          userId: order.userId,
          paymentStatus: 'Unpaid',
          transactionId: `COD-${Date.now()}`,
          amount,
          paymentMethod: 'COD',
        });
      }

      await payment.save();
      return res.status(200).json({
        success: true,
        message: 'COD selected. Payment will be collected at delivery.',
        payment,
      });
    }

    // Create Razorpay order for online payment
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      payment_capture: 1,
    });

    res.status(200).json({
      success: true,
      message: 'Online payment initiated',
      razorpayOrder,
    });
  } catch (error) {
    console.error('Payment Initiation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message,
    });
  }
};

const { v4: uuidv4 } = require('uuid'); // Import UUID

exports.verifyPayment = async (req, res) => {
  const {
    orderId,
    paymentId,
    razorpayOrderId,
    razorpaySignature,
    amount,
    paymentMethod,
  } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    // 🔍 **Verify Razorpay Signature**
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest('hex');

    if (!razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: 'Payment verification failed' });
    }

    // ✅ **Generate New Transaction ID**
    const transactionId = uuidv4(); // Unique transaction ID

    // ✅ **Create Payment Entry**
    const payment = new Payment({
      orderId,
      userId: order.userId,
      paymentStatus: 'Paid',
      transactionId, // Use the newly generated ID
      amount,
      paymentMethod,
    });

    await payment.save();

    // ✅ **Update Order Status**
    order.paymentId = payment._id;
    order.status = 'Confirmed';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order,
      payment,
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// exports.verifyPayment = async (req, res) => {
//   const { orderId, amount, paymentMethod } = req.body;

//   try {
//     // 1️⃣ **Find the order by orderId**
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Order not found' });
//     }

//     // 2️⃣ **Handle Cash on Delivery (COD) Payment**
//     if (paymentMethod === 'cod') {
//       let payment = await Payment.findOne({ orderId });

//       if (payment) {
//         // **Update existing payment record**
//         payment.paymentStatus = 'Unpaid';
//         payment.amount = amount || payment.amount;
//         payment.paymentMethod = 'COD';
//       } else {
//         // **Create a new payment record**
//         payment = new Payment({
//           orderId,
//           userId: order.userId,
//           paymentStatus: 'Unpaid',
//           transactionId: `COD-${Date.now()}`, // Unique COD identifier
//           amount,
//           paymentMethod: 'COD',
//         });
//       }

//       await payment.save();
//       return res.status(200).json({
//         success: true,
//         message: 'COD selected. Payment will be collected at delivery.',
//         payment,
//       });
//     }

//     // 3️⃣ **Handle Online Payment (Card, UPI, NetBanking, Wallet)**
//     const razorpayOrder = await razorpay.orders.create({
//       amount: amount * 100, // Convert to paise
//       currency: 'INR',
//       receipt: `order_${orderId}`,
//       payment_capture: 1, // Auto-capture payment
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Online payment initiated',
//       razorpayOrder,
//     });
//   } catch (error) {
//     console.error('Payment Verification Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Payment verification failed',
//       error: error.message,
//     });
//   }
// };

exports.confirmPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    // ✅ **Verify Signature**
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid payment signature' });
    }

    // ✅ **Update Payment Status**
    let payment = await Payment.findOne({ orderId });

    if (payment) {
      payment.paymentStatus = 'Paid';
      payment.transactionId = razorpay_payment_id;
    } else {
      payment = new Payment({
        orderId,
        userId: order.userId,
        paymentStatus: 'Paid',
        transactionId: razorpay_payment_id,
        amount: req.body.amount,
        paymentMethod: 'Online',
      });
    }

    await payment.save();

    // ✅ **Update Order Status**
    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'Paid';
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      payment,
    });
  } catch (error) {
    console.error('Payment Confirmation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment confirmation failed',
      error: error.message,
    });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalPaidOrders = await Payment.countDocuments({
      paymentStatus: 'Paid',
    });
    const totalUnpaidOrders = await Payment.countDocuments({
      paymentStatus: 'Unpaid',
    });

    const transactions = await Payment.find(
      {},
      {
        orderId: 1,
        amount: 1,
        paymentStatus: 1,
        transactionId: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    res.json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalPaidOrders,
      totalUnpaidOrders,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
