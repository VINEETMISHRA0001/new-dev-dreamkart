const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/MULTER/newMulter');
const sliderController = require('./../../controllers/SLIDERS/SliderController');

router.post('/', upload.single('image'), sliderController.createSlider); // Upload slider with image
router.get('/', sliderController.getSliders); // Get all sliders
router.put('/:id', upload.single('image'), sliderController.updateSlider); // Update slider and image
router.delete('/:id', sliderController.deleteSlider); // Delete slider

module.exports = router;
