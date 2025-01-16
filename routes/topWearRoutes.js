const express = require('express');
const router = express.Router();
const topWearController = require('../controllers/topWear');

router.post('/', topWearController.createTopWear);
router.get('/', topWearController.getAllTopWear);
router.put('/:id', topWearController.updateTopWear);
router.delete('/:id', topWearController.deleteTopWear);

module.exports = router;
