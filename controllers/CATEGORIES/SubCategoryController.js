// SubCategoryController.js
const Subcategory = require('../../models/CATEGORIES/SubcategoriesSchema');
const path = require('path');
const fs = require('fs');

// Create Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, parentCategory, description, image } = req.body;
    // let imagePath = null;

    // // Check if a file is provided
    // if (req.file) {
    //   const fileName = `${Date.now()}-${req.file.originalname}`;
    //   const uploadPath = path.join(__dirname, '../../uploads', fileName);
    //   fs.writeFileSync(uploadPath, req.file.buffer); // Save the file to the uploads folder
    //   imagePath = `/uploads/${fileName}`; // Save the relative path to the image
    // }

    // Create a new subcategory
    const subcategory = new Subcategory({
      name,
      parentCategory,
      description,
      // image: imagePath,
      image: image,
    });

    // Save to the database
    const savedSubcategory = await subcategory.save();
    res.status(201).json({ success: true, subcategory: savedSubcategory });
  } catch (error) {
    console.error('Error creating subcategory:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Subcategories
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('parentCategory');
    res.status(200).json({ success: true, subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory, description } = req.body;
    let imagePath = null;

    // Check if a new file is provided
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const uploadPath = path.join(__dirname, '../../uploads', fileName);
      fs.writeFileSync(uploadPath, req.file.buffer); // Save the file to the uploads folder
      imagePath = `/uploads/${fileName}`; // Save the relative path to the image
    }

    const updatedData = {
      name,
      parentCategory,
      description,
      ...(imagePath && { image: imagePath }),
    };

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json({ success: true, updatedSubcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the subcategory to delete
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, message: 'Subcategory not found' });
    }

    // Delete the image file if it exists
    if (subcategory.image) {
      const imagePath = path.join(__dirname, '../../', subcategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await subcategory.deleteOne();
    res
      .status(200)
      .json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Subcategories by Category ID
exports.getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find subcategories associated with the provided category ID
    const subcategories = await Subcategory.find({
      parentCategory: categoryId,
    });

    // Check if no subcategories were found
    if (subcategories.length === 0) {
      return res.status(200).json({
        success: true,
        subcategories: [],
        message: 'No subcategories found for this category',
      });
    }

    // Respond with the subcategories
    res.status(200).json({ success: true, subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
