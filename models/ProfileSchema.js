const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  alternateMobileNumber: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
