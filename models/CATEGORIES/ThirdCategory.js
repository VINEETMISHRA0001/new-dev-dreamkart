const mongoose = require('mongoose');

const thirdCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentSubcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  description: { type: String },
});

module.exports = mongoose.model('ThirdCategory', thirdCategorySchema);
