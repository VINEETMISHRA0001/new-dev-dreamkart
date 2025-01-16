const mongoose = require('mongoose');

const bottomWearSchema = new mongoose.Schema(
  {
    waistSizeRange: [
      {
        minSize: { type: Number },
        maxSize: { type: Number },
      },
    ], // Range of waist sizes available for bottom wear

    lengthType: { type: String }, // Full-length, cropped, etc.
    fitType: { type: String }, // Slim fit, regular fit, etc.
  },
  { _id: false }
); // Ensure _id is false if you don't need separate IDs for embedded documents

// Example of a pre-save hook
bottomWearSchema.pre('save', function (next) {
  console.log('Preparing to save bottom wear product...');
  next();
});

module.exports = mongoose.model('BottomWear', bottomWearSchema);
