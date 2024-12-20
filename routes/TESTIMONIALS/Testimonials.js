const express = require('express');
const multer = require('multer');
const {
  createTestimonial,
  getTestimonials,
  deleteTestimonial,
  uploadTestimonialImage,
} = require('./../../controllers/TESTIMONIALS/Testimonials');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for images

router.post('/', uploadTestimonialImage, createTestimonial);
router.get('/', getTestimonials);
router.delete('/:id', deleteTestimonial);

module.exports = router;
