const express = require('express');
const router = express.Router();
const homeSettingsController = require('./../controllers/HomeSettings');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router
  .route('/')
  .get(homeSettingsController.getHomeSettings)
  .post(
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
      { name: 'premiumLeftImage', maxCount: 1 },
    ]),
    homeSettingsController.createOrUpdateHomeSettings
  )
  .delete(homeSettingsController.deleteHomeSettings);

module.exports = router;
