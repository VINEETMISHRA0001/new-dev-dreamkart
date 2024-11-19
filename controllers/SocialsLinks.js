// controllers/socialLinksController.js
const SocialLink = require('../models/SocialsModels');

// Create a social media link
exports.createSocialLink = async (req, res) => {
  try {
    const socialLink = new SocialLink(req.body);
    await socialLink.save();
    res.status(201).json(socialLink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all social media links
exports.getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await SocialLink.find();
    res.json(socialLinks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific social media link by ID
exports.getSocialLinkById = async (req, res) => {
  try {
    const socialLink = await SocialLink.findById(req.params.id);
    if (!socialLink)
      return res.status(404).json({ message: 'Social link not found' });
    res.json(socialLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a social media link
exports.updateSocialLink = async (req, res) => {
  try {
    const socialLink = await SocialLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!socialLink)
      return res.status(404).json({ message: 'Social link not found' });
    res.json(socialLink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a social media link
exports.deleteSocialLink = async (req, res) => {
  try {
    const socialLink = await SocialLink.findByIdAndDelete(req.params.id);
    if (!socialLink)
      return res.status(404).json({ message: 'Social link not found' });
    res.json({ message: 'Social link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
