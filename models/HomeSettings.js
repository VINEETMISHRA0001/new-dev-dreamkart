const mongoose = require('mongoose');

const HomeSettingsSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  websiteTitle: { type: String, required: true },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  metaKeywords: [{ type: String, required: true }],
  contact: {
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  banner: {
    link: { type: String, required: false },
    bannerImage: { type: String, required: false },
  },
  features: [
    {
      icon: { type: String, required: false },
      title: { type: String, required: false },
      description: { type: String, required: false },
    },
  ],
  premiumMember: {
    leftImage: { type: String, required: false },
    description: { type: String, required: false },
  },
});

module.exports = mongoose.model('HomeSettings', HomeSettingsSchema);
