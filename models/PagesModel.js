const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  description: { type: String, required: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  sections: [sectionSchema],
});

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
