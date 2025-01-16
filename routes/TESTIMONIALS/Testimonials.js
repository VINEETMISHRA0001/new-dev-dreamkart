const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createTestimonial,
  getTestimonials,
  deleteTestimonial,
  uploadTestimonialImage,
  toggleTestimonialStatus,
} = require('./../../controllers/TESTIMONIALS/Testimonials');

const router = express.Router();

// Set up multer to store files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    ); // Use original file extension
  },
});

const upload = multer({ storage });

// Route to handle creating testimonials (with image upload)
router.post('/', upload.single('image'), createTestimonial);

// Route to get all testimonials
router.get('/', getTestimonials);

// Route to toggle the status of a testimonial (activate/deactivate)
router.patch('/:id/toggle', toggleTestimonialStatus);

// Route to delete a testimonial
router.delete('/:id', deleteTestimonial);

module.exports = router;
