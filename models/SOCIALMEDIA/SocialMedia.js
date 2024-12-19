const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, required: true }, // Store the image URL
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
