const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String, // Will store the YouTube thumbnail URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', VideoSchema);
