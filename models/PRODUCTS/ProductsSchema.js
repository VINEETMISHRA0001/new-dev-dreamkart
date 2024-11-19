const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  manufacturer: {
    type: String,
    trim: true,
  },
  material: {
    type: String, // Material type, e.g., "Cotton", "Polyester"
  },
  fabricCare: {
    type: String, // Care instructions, e.g., "Machine wash cold"
  },
  stock: {
    type: Number,
    default: 0,
  },
  sizes: [
    {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'], // Standard sizes
    },
  ],
  colors: [
    {
      type: String, // Color options
    },
  ],
  images: [
    {
      url: { type: String }, // URLs for product images
      altText: { type: String }, // Alt text for accessibility
    },
  ],
  variations: [
    {
      size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] },
      color: { type: String },
      stock: { type: Number, default: 0 },
      image: { type: String },
    },
  ],
  fit: {
    type: String, // e.g., "Slim Fit", "Regular Fit"
  },
  sizeChartImage: {
    type: String, // URL to size chart image
  },
  pattern: {
    type: String, // e.g., "Solid", "Striped", "Checked"
  },
  netWeight: {
    type: Number, // Product weight in grams or kg
  },
  productDimensions: {
    length: { type: Number }, // Length in cm
    width: { type: Number }, // Width in cm
    height: { type: Number }, // Height in cm
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback', // Reference to Review documents
    },
  ],
  tags: [
    {
      type: String, // Product tags for search optimization
    },
  ],
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
