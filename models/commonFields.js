const mongoose = require('mongoose');

const commonFieldsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortDescription: { type: String },
    longDescription: { type: String },
    styleId: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    gst: { type: Number },
    hsnCode: { type: String },
    inventory: { type: Number, default: 0 },
    // comboOf: { type: [String] },
    stitchType: { type: String },
    length: { type: String },
    pattern: { type: String },
    weight: { type: Number },
    countryOfOrigin: { type: String, default: 'India' },
    manufacturerDetails: { type: String },
    packerDetails: { type: String },
    importerDetails: { type: String },
    images: [{ type: String }],
    variations: [
      {
        color: { type: String, required: true },
        colorImages: [{ type: String }],
        sizes: [
          {
            size: { type: String, required: true },
            inventory: { type: Number, default: 0 },
          },
        ],
      },
    ],
    skuId: { type: String, required: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommonFields', commonFieldsSchema);
