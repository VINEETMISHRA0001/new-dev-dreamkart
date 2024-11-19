const mongoose = require("mongoose");

const subAdminSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("SubAdmin", subAdminSchema);
