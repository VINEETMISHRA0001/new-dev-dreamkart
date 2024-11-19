const express = require('express');
const thirdCategoryController = require('../../controllers/CATEGORIES/ThirdCategory');

const router = express.Router();

// CRUD routes
router.post('/', thirdCategoryController.createThirdCategory); // Create
router.get('/', thirdCategoryController.getAllThirdCategories); // Get all
router.get('/:id', thirdCategoryController.getThirdCategoryById); // Get by ID
router.put('/:id', thirdCategoryController.updateThirdCategory); // Update
router.delete('/:id', thirdCategoryController.deleteThirdCategory); // Delete

module.exports = router;
