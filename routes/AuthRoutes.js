const express = require('express');
const {
  registerUser,
  verifyOTP,
  forgotPassword,
  resetPassword,
  verifyPasswordResetOTP,
  loginUser,
  getAllUsers,
} = require('./../controllers/AuthController');
const router = express.Router();

router.post('/register', registerUser); // Step 1: Register and send OTP
router.post('/login', loginUser); // Step 1: Register and send OTP
router.post('/verify-otp', verifyOTP); // Step 2: Verify OTP and complete registration
router.post('/forgot-password', forgotPassword); // Step 2: Verify OTP and complete registration
router.post('/verify-reset-otp', verifyPasswordResetOTP);
router.post('/reset-password', resetPassword); // Step 2: Verify OTP and complete registration
// Verify OTP for Reset Password
router.get('/', getAllUsers);
module.exports = router;
