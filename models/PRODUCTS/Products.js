const mongoose = require('mongoose');
const slugify = require('slugify');
const productSchema = new mongoose.Schema(
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
    comboOf: { type: [String] },
    stitchType: { type: String },
    length: { type: String },
    neck: { type: String },
    occasion: { type: String },
    ornamentation: { type: String },
    pattern: { type: String },
    sleeveLength: { type: String },
    sleeveStyling: { type: String },
    weight: { type: Number },
    bustSize: { type: Number },
    shoulderSize: { type: Number },
    waistSize: { type: Number },
    hipSize: { type: Number },
    thirdCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ThirdCategory',
      required: true,
    },
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
    skuId: { type: String, required: true }, // New field added
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// Pre-save middleware to generate the slug
productSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('NewProduct', productSchema);
