const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/ImageBulkController');
const Image = require('../models/ImageBulkMode');

const router = express.Router();

// Configure Multer for memory storage (already configured in controller)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images'); // Handle multiple files

// Bulk upload route for images
router.post('/bulk-upload', upload, imageController.bulkImageUpload);

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
