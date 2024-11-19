const jwt = require("jsonwebtoken");
const AppError = require("./../../utils/AppError");
const Admin = require("./../../models/ADMIN/AdminSchema");
const CatchAsyncErrorjs = require("../../utils/CatchAsyncErrorjs");

exports.authenticateAdmin = CatchAsyncErrorjs(async (req, res, next) => {
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

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await Admin.findById(decoded.id);

    // Fetch the admin attached to this token
    const currentAdmin = await Admin.findById(decoded.id);

    if (!currentAdmin) {
      return next(
        new AppError("The admin belonging to this token no longer exists.", 401)
      );
    }

    // Attach the admin to the request object
    req.admin = currentAdmin;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Handle the case where the token is expired
      return next(
        new AppError("Your token has expired! Please log in again.", 401)
      );
    }

    // Handle other JWT verification errors
    return next(new AppError("Invalid token. Please log in again.", 401));
  }
});
