// models/CompanyInfo.js
const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    gstNumber: {
      type: String,
      trim: true,
      default: '',
    },
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    gstEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);
