// models/SocialLink.js
const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Facebook', 'Instagram'
  icon: { type: String, required: true }, // URL to icon image
  url: { type: String, required: true }, // Social media profile link
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SocialLink = mongoose.model('SocialLink', socialLinkSchema);
module.exports = SocialLink;
