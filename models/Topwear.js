const mongoose = require('mongoose');

const topWearSchema = new mongoose.Schema(
  {
    sleeveLength: { type: String }, // Example of top wear specific field
    neck: { type: String }, // Example of top wear specific field
    fabricType: { type: String }, // Example of top wear specific field
  },
  { _id: false }
);

// Example of a pre-save hook
topWearSchema.pre('save', function (next) {
  console.log('Preparing to save top wear product...');
  next();
});

module.exports = mongoose.model('TopWear', topWearSchema);
