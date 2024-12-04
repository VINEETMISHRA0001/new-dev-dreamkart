const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: { type: String },
  image: { type: String }, // Field to store the image URL
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
