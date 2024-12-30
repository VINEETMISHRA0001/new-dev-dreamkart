// models/Snippet.js
const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema(
  {
    jsCode: {
      type: String,
      required: true,
    },
    cssCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Snippet', snippetSchema);
