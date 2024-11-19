const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attribute', attributeSchema);
