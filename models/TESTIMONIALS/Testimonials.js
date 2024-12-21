const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // New field
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
