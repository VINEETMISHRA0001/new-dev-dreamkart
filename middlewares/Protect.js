const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema"); // Assuming you have a User model
const AppError = require("../utils/AppError");
const CatchAsyncErrorjs = require("../utils/CatchAsyncErrorjs");

exports.protect = CatchAsyncErrorjs(async (req, res, next) => {
  let token;

  // Check if the token is present in the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to access.", 401)
    );
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Fetch the admin attached to this token
  const currentAdmin = await Admin.findById(decoded.id); // Admin model should be used here

  if (!currentAdmin) {
    return next(
      new AppError("The admin belonging to this token no longer exists.", 401)
    );
  }

  // Attach the admin to the request object
  req.admin = currentAdmin; // Attach the admin instead of user

  next();
});
