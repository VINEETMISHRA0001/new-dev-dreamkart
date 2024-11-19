// models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  tags: [String],
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Health', 'Lifestyle', 'Business', 'Education'], // Example categories
  },
  comments: [
    {
      user: { type: String, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    // Add the imageUrl field to store the image path/URL
    type: String,
    required: false, // Optional, you can set to true if you want it to be required
  },
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
