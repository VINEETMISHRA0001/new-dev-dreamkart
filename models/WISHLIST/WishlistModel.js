// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewProduct', // Assuming you have a Product model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
