const express = require('express');
const router = express.Router();
const bottomWearController = require('../controllers/bottomWear');

// Create Bottom Wear
router.post('/', bottomWearController.createBottomWear);

// Get All Bottom Wear
router.get('/', bottomWearController.getAllBottomWear);

// Update Bottom Wear
router.put('/:id', bottomWearController.updateBottomWear);

// Delete Bottom Wear
router.delete('/:id', bottomWearController.deleteBottomWear);

module.exports = router;
