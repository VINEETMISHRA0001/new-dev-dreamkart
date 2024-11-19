const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  uniqueKey: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "subadmin"],
    default: "admin",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Ensure only one admin can be created
adminSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({ role: "admin" });
    if (count >= 1) {
      return next(new Error("The admin has already registered.")); // Pass to next for error handling
    }
  }
  next();
});

module.exports = mongoose.model("Admin", adminSchema);
