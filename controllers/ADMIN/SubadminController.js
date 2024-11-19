const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const AppError = require("./../../utils/AppError");
const jwt = require("jsonwebtoken");
const CatchAsyncError = require("./../../utils/CatchAsyncErrorjs");
const SubAdmin = require("./../../models/ADMIN/SubAdminSchema"); // Adjust the path as needed

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "9h", // Token expires in 1 hour
  });
};

exports.registerSubAdmin = CatchAsyncError(async (req, res, next) => {
  // Ensure only an admin can register subadmins
  if (req.user.role !== "admin") {
    return next(new AppError("Only admin can register subadmins.", 403));
  }

  const { email, password } = req.body;

  // Check if a subadmin with the same email already exists
  const existingSubAdmin = await SubAdmin.findOne({ email });
  if (existingSubAdmin) {
    return next(new AppError("A user with this email already exists.", 400));
  }

  // Create new subadmin
  const subAdmin = new SubAdmin({
    email,
    password: await bcrypt.hash(password, 10),
    uniqueKey: uuidv4(), // Generate a unique key
  });

  await subAdmin.save();

  res.status(201).json({
    status: "success",
    message: "Subadmin registered successfully.",
  });
});

// LOGIN SUBADMIN

// LOGIN SUBADMIN
exports.loginSubAdmin = CatchAsyncError(async (req, res, next) => {
  const { email, password, uniqueKey } = req.body;

  const subAdmin = await SubAdmin.findOne({ email });
  if (!subAdmin) {
    return next(
      new AppError("Invalid credentials or subadmin not verified.", 401)
    );
  }

  const isMatch = await bcrypt.compare(password, subAdmin.password);
  if (!isMatch || subAdmin.uniqueKey !== uniqueKey) {
    return next(new AppError("Invalid credentials.", 401));
  }

  const token = generateToken(subAdmin._id, subAdmin.email);
  res.status(200).json({
    status: "success",
    token,
    subadmin: {
      id: subAdmin._id,
      email: subAdmin.email,
      role: subAdmin.role,
    },
  });
});
