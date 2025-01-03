const Category = require('../../models/CATEGORIES/CategoriesSchema');
const path = require('path');
const fs = require('fs');

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Delete the file
  }
};
exports.createCategory = async (req, res) => {
  try {
    const { name, description, metaTitle, metaDescription, metaKeywords } =
      req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'Image is required' });
    }

    console.log('Uploaded file:', req.file);

    // Save the file to the uploads folder
    const uploadsDir = path.join(__dirname, './../../uploads/categories');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = `uploads/${req.file.originalname}`; // Relative path
    fs.writeFileSync(
      path.join(__dirname, './../../', filePath),
      req.file.buffer
    );

    // Create and save the category document
    const category = new Category({
      name,
      description,
      image: filePath, // Save the relative path in the database
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywords ? metaKeywords.split(',') : [],
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: savedCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, metaTitle, metaDescription, metaKeywords } =
      req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }

    let imageUrl = category.image;

    // If a new image is provided, delete the old one and save the new one
    if (req.file) {
      if (imageUrl) {
        deleteFile(path.join(__dirname, '../../', imageUrl)); // Delete old image
      }
      imageUrl = `/uploads/category-images/${req.file.filename}`;
    }

    const updatedData = {
      name,
      description,
      image: imageUrl,
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywords ? metaKeywords.split(',') : [],
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({ success: true, updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }

    // Delete the image from local storage if it exists
    if (category.image) {
      deleteFile(path.join(__dirname, '../../', category.image));
    }

    await category.deleteOne();
    res
      .status(200)
      .json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
