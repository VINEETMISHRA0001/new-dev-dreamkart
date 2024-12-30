const express = require('express');
const router = express.Router();
const homeSettingsController = require('../controllers/HomeSettings');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for temporary file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to clean up temporary uploaded files
const cleanUpFiles = (req, res, next) => {
  const files = req.files || {};
  const allFiles = Object.values(files).flat(); // Flatten files object

  allFiles.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Error deleting temp file: ${file.path}`, err);
    });
  });

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
    cleanUpFiles // Clean up temp files after processing
  )
  .delete(homeSettingsController.deleteHomeSettings);

module.exports = router;
