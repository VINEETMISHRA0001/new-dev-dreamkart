const jwt = require("jsonwebtoken");
const User = require("./../models/UserSchema");
const AppError = require("./../utils/AppError"); // Adjust the path as needed
const CatchAsyncErrorjs = require("../utils/CatchAsyncErrorjs");

exports.verifyUser = CatchAsyncErrorjs(async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // Format: 'Bearer <token>'

  if (!token) {
    return next(new AppError("No token provided. Authorization denied.", 401));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user by ID
    const user = await User.findById(decoded.id);

    if (!user || !user.isVerified) {
      return next(new AppError("User is not verified or authenticated.", 403));
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return next(new AppError("Token is not valid.", 401));
  }
});
