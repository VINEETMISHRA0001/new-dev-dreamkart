const HomeSettings = require('../models/HomeSettings');
const fs = require('fs');
const path = require('path');

// Helper function to save file to disk
const saveFile = (buffer, filename, folder = 'uploads') => {
  const uploadDir = path.join(__dirname, `../${folder}`);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

// Get all home settings
exports.getHomeSettings = async (req, res, next) => {
  try {
    const settings = await HomeSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Home settings not found' });
    }
    res.status(200).json({
      status: 'success',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Create or Update home settings
exports.createOrUpdateHomeSettings = async (req, res, next) => {
  try {
    const data = req.body;
    const fileFields = {};

    // Handle file uploads
    if (req.files?.logo) {
      const logoFile = req.files.logo[0];
      const logoPath = saveFile(
        logoFile.buffer,
        `logo_${Date.now()}${path.extname(logoFile.originalname)}`
      );
      fileFields.logo = logoPath; // Save path to database
    }

    if (req.files?.bannerImage) {
      const bannerFile = req.files.bannerImage[0];
      const bannerPath = saveFile(
        bannerFile.buffer,
        `banner_${Date.now()}${path.extname(bannerFile.originalname)}`
      );
      fileFields['banner.bannerImage'] = bannerPath;
    }

    if (req.files?.premiumLeftImage) {
      const premiumFile = req.files.premiumLeftImage[0];
      const premiumPath = saveFile(
        premiumFile.buffer,
        `premium_${Date.now()}${path.extname(premiumFile.originalname)}`
      );
      fileFields['premiumMember.leftImage'] = premiumPath;
    }

    // Update or create home settings
    const settings = await HomeSettings.findOneAndUpdate(
      {}, // Query to match one document (only one settings document exists)
      { $set: { ...data, ...fileFields } }, // Merge form data and uploaded files
      { new: true, upsert: true } // Create if not exists, otherwise update
    );

    res.status(200).json({
      status: 'success',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Delete all home settings (optional)
exports.deleteHomeSettings = async (req, res, next) => {
  try {
    await HomeSettings.deleteMany({});
    res.status(204).json({
      status: 'success',
      message: 'Home settings deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
