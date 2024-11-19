const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },

  otp: {
    type: String,
  }, // Temporarily stores the OTP

  otpExpires: {
    type: Date,
  }, // Expiry time for OTP

  isVerified: {
    type: Boolean,
    default: false,
  }, // Verification status

  password: {
    type: String,
  }, // Will be added later once verified
});

const User = mongoose.model('User', userSchema);
module.exports = User;
