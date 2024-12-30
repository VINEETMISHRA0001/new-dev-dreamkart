const HomeSettings = require('../models/HomeSettings');

// Get all home settings
exports.getHomeSettings = async (req, res, next) => {
  try {
    const settings = await HomeSettings.findOne();
    if (!settings) {
      return res.status(404).json({
        status: 'fail',
        message: 'Home settings not found.',
      });
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

    // Process uploaded files if any
    if (req.files?.logo) fileFields.logo = req.files.logo[0].path;
    if (req.files?.bannerImage)
      fileFields['banner.bannerImage'] = req.files.bannerImage[0].path;
    if (req.files?.premiumLeftImage)
      fileFields['premiumMember.leftImage'] =
        req.files.premiumLeftImage[0].path;

    const settings = await HomeSettings.findOneAndUpdate(
      {}, // Query to match one document
      { $set: { ...data, ...fileFields } },
      { new: true, upsert: true }
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
