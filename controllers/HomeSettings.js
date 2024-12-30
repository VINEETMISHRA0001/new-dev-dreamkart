const HomeSettings = require('../models/HomeSettings');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Get all home settings
exports.getHomeSettings = async (req, res, next) => {
  try {
    const settings = await HomeSettings.findOne();
    if (!settings) {
      return;
    }
    res.status(200).json({
      status: 'success',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Upload file to Cloudinary
const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'home-settings',
    use_filename: true,
  });
  return result.secure_url; // Return the uploaded image's secure URL
};

// Create or Update home settings
exports.createOrUpdateHomeSettings = async (req, res, next) => {
  try {
    const data = req.body;
    const fileFields = {};

    // Handle file uploads
    if (req.files?.logo) {
      fileFields.logo = await uploadToCloudinary(req.files.logo[0].path);
    }
    if (req.files?.bannerImage) {
      fileFields['banner.bannerImage'] = await uploadToCloudinary(
        req.files.bannerImage[0].path
      );
    }
    if (req.files?.premiumLeftImage) {
      fileFields['premiumMember.leftImage'] = await uploadToCloudinary(
        req.files.premiumLeftImage[0].path
      );
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
