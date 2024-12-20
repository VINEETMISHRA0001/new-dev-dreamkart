const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/MULTER/newMulter');
const sliderController = require('./../../controllers/SLIDERS/SliderController');

router.post('/', upload.array('image', 1), sliderController.createSlider); // Upload slider with image
router.get('/', sliderController.getSliders); // Get all sliders
router.put('/:id', upload.array('image', 1), sliderController.updateSlider); // Update slider and image
router.delete('/:id', sliderController.deleteSlider); // Delete slider

module.exports = router;
