const Page = require('../models/PagesModel');

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single page by ID
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new page
exports.createPage = async (req, res) => {
  const {
    title,
    order,
    description,
    metaTitle,
    metaDescription,
    metaKeywords,
    sections,
  } = req.body;
  try {
    const newPage = new Page({
      title,
      order,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
      sections,
    });
    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a page by ID
exports.updatePage = async (req, res) => {
  try {
    const updatedPage = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPage)
      return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a page by ID
exports.deletePage = async (req, res) => {
  try {
    const deletedPage = await Page.findByIdAndDelete(req.params.id);
    if (!deletedPage)
      return res.status(404).json({ message: 'Page not found' });
    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
