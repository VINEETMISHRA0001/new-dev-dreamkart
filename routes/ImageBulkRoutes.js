const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/ImageBulkController');
const Image = require('../models/ImageBulkMode');

const router = express.Router();

// Configure Multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

// Bulk upload route for ZIP files
router.post(
  '/bulk-upload',
  upload.single('zipfile'),
  imageController.bulkImageUpload
);

// Fetch all uploaded images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
