const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  gst: { type: Number },
  hsnCode: { type: String },
  size: { type: String },
  attributes: { type: Map, of: String }, // Flexible attributes like color, fabric, etc.
  stockQuantity: { type: Number },
  thirdCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThirdCategory',
    required: true,
  },
  countryOfOrigin: { type: String, default: 'India' },
  manufacturerDetails: { type: String },
  packerDetails: { type: String },
  importerDetails: { type: String },
  images: [{ type: String }], // Array of image URLs
});

module.exports = mongoose.model('New-Product', productSchema);
