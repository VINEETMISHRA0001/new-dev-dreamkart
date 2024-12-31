const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // Field to store the image URL
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: [String] }, // Array of keywords
});

module.exports = mongoose.model('Category', categorySchema);
