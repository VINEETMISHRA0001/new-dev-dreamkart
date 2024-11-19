const Admin = require('./../../models/ADMIN/AdminSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating unique keys
const AppError = require('./../../utils/AppError');
const CatchAsyncError = require('./../../utils/CatchAsyncErrorjs');
const sendVerificationEmail = require('./../../utils/SendEmail'); // Function to send verification email

// utility for token generation

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '8h', // Token expires in 1 hour
  });
};

exports.registerAdmin = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the admin already exists
  const existingAdmin = await Admin.findOne({ role: 'admin' });
  if (existingAdmin) {
    return next(new AppError('An admin already exists.', 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate unique key
  const uniqueKey = crypto.randomBytes(16).toString('hex');

  const admin = new Admin({
    email,
    password: hashedPassword,
    uniqueKey,
    role: 'admin', // Make sure to set the role to admin
  });

  await admin.save();

  // Send verification email (implement the function)
  await sendVerificationEmail(admin.email, uniqueKey);

  res.status(201).json({
    status: 'success',
    message:
      'Admin registered successfully. Check your email for verification.',
  });
});

// VERIFY ADMIN

exports.verifyAdmin = CatchAsyncError(async (req, res, next) => {
  const { uniqueKey } = req.body;

  const admin = await Admin.findOne({ uniqueKey });
  if (!admin) {
    return next(new AppError('Invalid unique key.', 400));
  }

  admin.isVerified = true;
  await admin.save();

  res.status(200).json({
    status: 'success',
    message: 'Admin verified successfully.',
  });
});

// LOGIN ADMIN
// loginAdmin controller
// exports.loginAdmin = CatchAsyncError(async (req, res, next) => {
//   const { email, password, uniqueKey } = req.body;

//   const admin = await Admin.findOne({ email });
//   if (!admin || !admin.isVerified) {
//     return next(
//       new AppError("Invalid credentials or admin not verified.", 401)
//     );
//   }

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch || admin.uniqueKey !== uniqueKey) {
//     return next(new AppError("Invalid credentials.", 401));
//   }

//   // Generate a JWT or session
//   const token = generateToken(admin._id, admin.email); // Implement token generation

//   // Set a cookie with the token
//   res.cookie("token", token, {
//     httpOnly: true, // Prevents client-side access to the cookie
//     secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//   });

//   res.status(200).json({
//     status: "success",
//     admin: {
//       id: admin._id,
//       email: admin.email,
//       role: admin.role,
//     },
//   });
// });

exports.loginAdmin = CatchAsyncError(async (req, res, next) => {
  const { email, password, uniqueKey } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || !admin.isVerified) {
    return next(
      new AppError('Invalid credentials or admin not verified.', 401)
    );
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch || admin.uniqueKey !== uniqueKey) {
    return next(new AppError('Invalid credentials.', 401));
  }

  // Generate a JWT with the correct _id
  const token = generateToken(admin._id, admin.email); // Make sure it's _id

  // Set a cookie with the token
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Change to true in production
    sameSite: false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    status: 'success',
    admin: {
      id: admin._id,
      email: admin.email,
      token,
      role: admin.role,
    },
  });
});

// ADMIN DETS

exports.getDets = CatchAsyncError(async (req, res, next) => {
  if (!req.admin) {
    return next(new AppError('No admin found.', 404));
  }

  console.log(req.admin);

  res.status(200).json({
    status: 'success',
    admin: {
      id: req.admin._id, // Accessing _id instead of id
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});
