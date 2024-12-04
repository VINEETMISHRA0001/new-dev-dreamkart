const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewProduct',
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },

      selectedSize: String,
      selectedColor: String,
      viewed: { type: Boolean, default: false }, // New field
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending', // can be 'Pending', 'Shipped', 'Delivered', etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
