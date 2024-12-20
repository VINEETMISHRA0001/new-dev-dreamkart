const express = require('express');
const router = express.Router();
const {
  uploadSliderImage,
} = require('./../../controllers/SLIDERS/SliderController');
const sliderController = require('./../../controllers/SLIDERS/SliderController');

router.post('/', uploauploadSliderImage, sliderController.createSlider); // Upload slider with image
router.get('/', sliderController.getSliders); // Get all sliders
router.put('/:id', uploadSliderImage, sliderController.updateSlider); // Update slider and image
router.delete('/:id', sliderController.deleteSlider); // Delete slider

module.exports = router;
