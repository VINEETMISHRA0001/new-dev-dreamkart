const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cloudinaryId: { type: String, required: true }, // Store Cloudinary public ID
  imageUrl: { type: String, required: true }, // Store the full image URL
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Slider', sliderSchema);
