const mongoose = require('mongoose');

const CompanyInfoSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: { type: String, required: true },
  gstNumber: String,
  registrationNumber: String,
  website: String,
  gstEnabled: { type: Boolean, default: false },
});

module.exports = mongoose.model('CompanyInfo', CompanyInfoSchema);
