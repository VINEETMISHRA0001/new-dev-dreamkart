const mongoose = require("mongoose");

const productVariationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: { type: String, required: false }, // Size is optional
  color: { type: String, required: false }, // Color is optional
  quantity: { type: Number, required: true, min: 1 },
});

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productDetails: {
    name: { type: String, required: true },
    category: { type: String, required: true },
    variations: productVariationSchema, // Use the productVariationSchema
  },
  createdAt: { type: Date, default: Date.now },
});

// Cart schema can hold multiple cart items
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

// Model
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
