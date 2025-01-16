const express = require('express');
const router = express.Router();
const homeSettingsController = require('../controllers/HomeSettings');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to clean up memory after processing (not needed here but kept for clarity)
const cleanUpFiles = (req, res, next) => {
  // No file cleanup needed since files are stored in memory
  next();
};

router
  .route('/')
  .get(homeSettingsController.getHomeSettings)
  .post(
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
      { name: 'premiumLeftImage', maxCount: 1 },
    ]),
    homeSettingsController.createOrUpdateHomeSettings,
    cleanUpFiles // Clean up memory (if needed)
  )
  .delete(homeSettingsController.deleteHomeSettings);

module.exports = router;
