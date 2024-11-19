const jwt = require("jsonwebtoken");
const User = require("./../models/UserSchema");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateUser;
