const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    attribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attribute',
      required: true,
    },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);
