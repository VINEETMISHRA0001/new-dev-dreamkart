const express = require('express');
const categoryController = require('../../controllers/CATEGORIES/CategoryController'); // Adjust path as per your project structure

const router = express.Router();

// Route to create a category
router.post('/', categoryController.createCategory);

// Route to get all categories
router.get('/', categoryController.getCategories);

// Route to update a category by ID
router.put('/:id', categoryController.updateCategory);

// Route to delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
