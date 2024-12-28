const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Ensure title is unique
  order: { type: Number, required: true, unique: true }, // Ensure order is unique
  description: { type: String, required: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  sections: [sectionSchema],
});

// To ensure unique indexes in the database
pageSchema.index({ title: 1 }, { unique: true });
pageSchema.index({ order: 1 }, { unique: true });

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
