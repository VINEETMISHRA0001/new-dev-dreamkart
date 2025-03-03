const User = require('./../models/UserSchema');
const CatchAsyncErrorjs = require('../utils/CatchAsyncErrorjs');
const sendEmail = require('./../utils/SendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');

// Utility to generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// utility to generate token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '10d', // Token expires in 10 days
  });
};

// Step 1: Register user and send OTP to email
exports.registerUser = CatchAsyncErrorjs(async (req, res, next) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    // Check if user is already registered and verified
    if (user && user.isVerified) {
      return next(new AppError('User already registered and verified.', 400));
    }

    // Generate OTP and OTP expiration time (10 minutes)
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    if (!user) {
      // Create new user if doesn't exist
      user = new User({ email, otp, otpExpires });
    } else {
      // Update OTP for existing unverified user
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Send OTP via email
    const message = `Your OTP code is ${otp}. This code will expire in 10 minutes.`;
    await sendEmail({
      email: user.email,
      subject: 'Your OTP Code',
      message,
      otp, // Pass OTP to include it in the email
      name: user.name || '', // Optional: Pass user's name if available
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
});

// Step 2: Verify OTP and complete registration
exports.verifyOTP = CatchAsyncErrorjs(async (req, res, next) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('Invalid email address.', 400));
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return next(new AppError('Invalid or expired OTP.', 400));
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mark the user as verified and save the hashed password
    user.isVerified = true;
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Include email in the token payload
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Set the JWT token as a cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
      sameSite: 'strict', // Helps protect against CSRF attacks
      maxAge: 60 * 60 * 1000, // Cookie expiry (1 hour)
    });

    res.status(200).json({
      message: 'User successfully registered and verified',
      token,
      email: user.email, // Send email in the response
    });
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
});

// Forgot Password
exports.forgotPassword = CatchAsyncErrorjs(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required.', 400));
  }

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  // Generate OTP and expiration time
  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Update user with OTP and expiry
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send OTP via email
  const message = `Your OTP code for password reset is ${otp}. It will expire in 10 minutes.`;
  await sendEmail({
    email: user.email,
    subject: 'Password Reset OTP',
    message,
  });

  res.status(200).json({ message: 'OTP sent to your email.' });
});

// VERIFY RESET PASSWORD OTP
// Step 2: Verify OTP
exports.verifyPasswordResetOTP = CatchAsyncErrorjs(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError('Both email and OTP are required.', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  // Validate OTP and expiration
  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return next(new AppError('Invalid or expired OTP.', 400));
  }

  // OTP is valid, clear OTP and otpExpires from the database
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Send a response indicating OTP verification was successful
  res.status(200).json({
    message: 'OTP is valid. You can now reset your password.',
  });
});

// Reset Password API
exports.resetPassword = CatchAsyncErrorjs(async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return next(
      new AppError(
        'All fields (email, new password, confirm password) are required.',
        400
      )
    );
  }

  if (newPassword !== confirmPassword) {
    return next(
      new AppError('New password and confirm password do not match.', 400)
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  // Ensure OTP is cleared before allowing password reset
  if (user.otp !== undefined || user.otpExpires !== undefined) {
    return next(
      new AppError(
        'OTP verification step is required before resetting password.',
        403
      )
    );
  }

  // Hash the new password
  user.password = await bcrypt.hash(newPassword, 10);

  // Clear the OTP and expiry fields (in case of any left data)
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({
    message: 'Password has been reset successfully.',
  });
});

// lOGIN USER
exports.loginUser = CatchAsyncErrorjs(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError('Please provide both email and password.', 400));
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  // Check if the user is verified
  if (!user.isVerified) {
    return next(
      new AppError(
        'User is not verified. Please verify your account first.',
        403
      )
    );
  }

  // Compare entered password with the hashed password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password.', 401));
  }

  // Generate JWT token
  const token = generateToken(user._id, user.email);

  // Set the JWT token as a cookie (optional, depends on your needs)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // Cookie expiry (9 hour)
  });

  // Return the token and user details (you can customize the response)
  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  });
});

// Get All users Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) return res.send(400).json({ message: 'No Users found!' });

    res.status(200).json({ message: 'Success', users });
  } catch (error) {
    next(error);
  }
};
