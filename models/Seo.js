const mongoose = require('mongoose');

const SEOSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: String,
    },
    canonicalURL: {
      type: String,
    },
    structuredData: {
      type: String, // Storing JSON-LD as a string
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model('SEO', SEOSchema);
