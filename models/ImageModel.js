const mongoose = require("mongoose");

// Image schema
const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
