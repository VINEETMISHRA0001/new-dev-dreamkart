// models/ProductFeedback.js
const mongoose = require("mongoose");

const productFeedbackSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product", // Reference to the Product model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  starRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Allow star ratings from 1 to 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String, // URL of the images
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", productFeedbackSchema);
