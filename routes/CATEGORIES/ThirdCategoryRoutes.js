const express = require('express');
const thirdCategoryController = require('../../controllers/CATEGORIES/ThirdCategory');
const upload = require('../../uploads/multer');

const router = express.Router();

// CRUD routes
router.post(
  '/',
  upload.single('image'),
  thirdCategoryController.createThirdCategory
); // Create
router.get('/', thirdCategoryController.getAllThirdCategories); // Get all
router.get(
  '/:subcategoryId',
  thirdCategoryController.getThirdCategoriesBySubcategoryId
); // Get all
router.get('/:id', thirdCategoryController.getThirdCategoryById); // Get by ID
router.put(
  '/:id',
  upload.single('image'),
  thirdCategoryController.updateThirdCategory
); // Update
router.delete('/:id', thirdCategoryController.deleteThirdCategory); // Delete

module.exports = router;
