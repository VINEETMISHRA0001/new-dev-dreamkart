const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const socialMediaController = require('./../../controllers/SOCIAL/SocialController');

// Set up storage for image upload using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create social media
router.post(
  '/',
  socialMediaController.uploadSocialMediaIcon,
  socialMediaController.createSocialMedia
);

// Get all social media
router.get('/', socialMediaController.getAllSocialMedia);

// Get single social media by ID
router.get('/:id', socialMediaController.getSocialMediaById);

// Update social media
router.put(
  '/:id',
  socialMediaController.uploadSocialMediaIcon,
  socialMediaController.updateSocialMedia
);

// Delete social media
router.delete('/:id', socialMediaController.deleteSocialMedia);

module.exports = router;
