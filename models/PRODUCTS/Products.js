const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortDescription: { type: String },
    longDescription: { type: String },
    styleId: { type: String },
    mrp: { type: Number, required: true }, // Maximum Retail Price
    price: { type: Number, required: true }, // Selling Price
    discount: { type: Number, default: 0 }, // Discount percentage
    gst: { type: Number },
    hsnCode: { type: String }, // Harmonized System Nomenclature code
    inventory: { type: Number, default: 0 },
    comboOf: { type: [String] }, // E.g., combo of Kurti and Dupatta
    stitchType: { type: String }, // Ready to wear, semi-stitched, etc.
    fabric: { type: String }, // Material type, e.g., Cotton, Rayon
    length: { type: String }, // E.g., Knee-length, Ankle-length
    neck: { type: String }, // E.g., Round Neck, V-Neck
    occasion: { type: String }, // E.g., Casual, Festive, Office Wear
    ornamentation: { type: String }, // Embroidery, Mirror Work, etc.
    pattern: { type: String }, // E.g., Printed, Solid, Striped
    sleeveLength: { type: String }, // E.g., Full, Three-quarter, Sleeveless
    sleeveStyling: { type: String }, // E.g., Regular, Bell Sleeves
    hemline: { type: String }, // E.g., Straight, Flared, Asymmetric
    yokeDesign: { type: String }, // E.g., Embroidered, Printed
    transparency: { type: String }, // E.g., Opaque, Semi-Sheer
    fitType: { type: String }, // E.g., Regular Fit, Slim Fit
    weight: { type: Number }, // Weight of the product in grams
    bustSize: { type: Number },
    shoulderSize: { type: Number },
    waistSize: { type: Number },
    hipSize: { type: Number },
    washingCare: { type: String }, // E.g., Machine Wash, Hand Wash Only
    closureType: { type: String }, // E.g., Zipper, Button, Hook
    liningMaterial: { type: String }, // Inner material details
    embellishments: { type: [String] }, // List of embellishments, e.g., Sequins, Lace
    thirdCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ThirdCategory',
      required: true,
    },
    countryOfOrigin: { type: String, default: 'India' },
    manufacturerDetails: { type: String },
    packerDetails: { type: String },
    importerDetails: { type: String },
    careInstructions: { type: String }, // E.g., Do not bleach, Iron on low heat
    images: [{ type: String }], // Main images for the product
    videos: [{ type: String }], // Video URLs showcasing the product
    variations: [
      {
        color: { type: String, required: true },
        colorImages: [{ type: String }], // Images specific to the color
        sizes: [
          {
            size: { type: String, required: true }, // E.g., S, M, L, XL
            inventory: { type: Number, default: 0 },
          },
        ],
      },
    ],
    skuId: { type: String, required: true, unique: true }, // Stock Keeping Unit ID
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    slug: { type: String, unique: true }, // SEO-friendly URL slug
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
