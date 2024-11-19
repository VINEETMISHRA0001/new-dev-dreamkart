const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);
