const express = require('express');
const subcategoryController = require('../../controllers/CATEGORIES/SubcategoryController'); // Adjust path as needed

const router = express.Router();

// Create a new subcategory
router.post('/', subcategoryController.createSubcategory);

// Get all subcategories
router.get('/', subcategoryController.getSubcategories);

// Update a subcategory by ID
router.put('/:id', subcategoryController.updateSubcategory);

// Delete a subcategory by ID
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
