const Payment = require('../models/Payment');

exports.processPayment = CatchAsyncError(async (req, res, next) => {
  const { orderId, amountPaid, paymentMethod, transactionId } = req.body;
  const userId = req.user.id; // Logged-in user ID

  if (!orderId || !amountPaid || !paymentMethod || !transactionId) {
    return res
      .status(400)
      .json({ status: 'error', message: 'All payment details are required' });
  }

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Order not found' });
  }

  if (order.paymentStatus === 'Paid') {
    return res
      .status(400)
      .json({ status: 'error', message: 'Order is already paid' });
  }

  // Create payment record
  const newPayment = await Payment.create({
    orderId,
    userId,
    amountPaid,
    paymentMethod,
    transactionId,
    paymentStatus: 'Paid',
    paidAt: new Date(),
  });

  // Update order status
  order.paymentStatus = 'Paid';
  order.status = 'Processing'; // Order moves to the next stage
  order.paymentId = newPayment._id;
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Payment processed successfully',
    payment: newPayment,
    order,
  });
});
