const multer = require('multer');

// Multer memory storage configuration
const storage = multer.memoryStorage();

// Middleware to handle single image upload
const upload = multer({ storage });

module.exports = upload;

// Routes: subcategoryRoutes.js
const express = require('express');
const subcategoryController = require('../../controllers/CATEGORIES/SubCategoryController');
// const upload = require('../../uploads/multer');

const router = express.Router();

// Create a new subcategory
router.post(
  '/',
  upload.single('image'),
  subcategoryController.createSubcategory
);

// Get all subcategories
router.get('/:categoryId', subcategoryController.getSubcategoriesByCategoryId);
router.get('/', subcategoryController.getSubcategories);

// Update a subcategory by ID
router.put(
  '/:id',
  upload.single('image'),
  subcategoryController.updateSubcategory
);

// Delete a subcategory by ID
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
