// controllers/snippetController.js
const Snippet = require('../models/Code');

// Create Snippet
exports.createSnippet = async (req, res) => {
  try {
    const { jsCode, cssCode } = req.body;
    const newSnippet = new Snippet({
      jsCode,
      cssCode,
    });

    await newSnippet.save();
    res
      .status(201)
      .json({ message: 'Snippet created successfully', snippet: newSnippet });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating snippet', error: err.message });
  }
};

// Get All Snippets
exports.getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.status(200).json(snippets);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching snippets', error: err.message });
  }
};

// Get Snippet by ID
exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json(snippet);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching snippet', error: err.message });
  }
};

// Update Snippet
exports.updateSnippet = async (req, res) => {
  try {
    const { jsCode, cssCode } = req.body;
    const snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      { jsCode, cssCode },
      { new: true }
    );
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json({ message: 'Snippet updated successfully', snippet });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating snippet', error: err.message });
  }
};

// Delete Snippet
exports.deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findByIdAndDelete(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting snippet', error: err.message });
  }
};
