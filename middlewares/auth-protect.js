const jwt = require("jsonwebtoken");
const User = require("../models/ADMIN/AdminSchema");
const AppError = require("../utils/AppError");
const CatchAsyncErrorjs = require("../utils/CatchAsyncErrorjs");

exports.protect = CatchAsyncErrorjs(async (req, res, next) => {
  let token;
  //   const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
  //     expiresIn: "1d",
  //   });

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

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch the user attached to this token
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // Attach the user to the request object
    req.user = currentUser;

    next();
  } catch (error) {
    return next(new AppError("Invalid token. Please log in again.", 401));
  }
});
