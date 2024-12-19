const express = require('express');
const multer = require('multer');
const {
  createTestimonial,
  getTestimonials,
  deleteTestimonial,
} = require('./../../controllers/TESTIMONIALS/Testimonials');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for images

router.post('/', upload.single('image'), createTestimonial);
router.get('/', getTestimonials);
router.delete('/:id', deleteTestimonial);

module.exports = router;
