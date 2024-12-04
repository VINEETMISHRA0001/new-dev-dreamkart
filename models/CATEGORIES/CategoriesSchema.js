const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // Field to store the image URL
});

module.exports = mongoose.model('Category', categorySchema);
