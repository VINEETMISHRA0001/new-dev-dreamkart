const ThirdCategory = require('../../models/CATEGORIES/ThirdCategory');
const fs = require('fs');
const path = require('path');

// Create Third Category
exports.createThirdCategory = async (req, res) => {
  try {
    const { name, parentSubcategory, description } = req.body;
    let image = null;

    // Save the file to the uploads folder if provided
    if (req.file) {
      const uploadPath = path.join(__dirname, '../../uploads/third_categories');

      // Ensure the directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const imagePath = path.join(uploadPath, req.file.originalname);
      fs.writeFileSync(imagePath, req.file.buffer); // Save the image to the uploads folder
      image = `uploads/third_categories/${req.file.originalname}`; // Save relative path
    }

    // Create a new third category
    const thirdCategory = new ThirdCategory({
      name,
      parentSubcategory,
      description,
      image,
    });

    // Save to the database
    const savedCategory = await thirdCategory.save();
    res.status(201).json({ success: true, thirdCategory: savedCategory });
  } catch (error) {
    console.error('Error creating third category:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Third Categories
exports.getAllThirdCategories = async (req, res) => {
  try {
    const thirdCategories = await ThirdCategory.find().populate(
      'parentSubcategory'
    );
    res.status(200).json({ success: true, thirdCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a Specific Third Category by ID
exports.getThirdCategoryById = async (req, res) => {
  try {
    const thirdCategory = await ThirdCategory.findById(req.params.id).populate(
      'parentSubcategory'
    );
    if (!thirdCategory) {
      return res
        .status(404)
        .json({ success: false, message: 'Third category not found' });
    }
    res.status(200).json({ success: true, thirdCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a Third Category by ID
exports.updateThirdCategory = async (req, res) => {
  try {
    const { name, parentSubcategory, description } = req.body;
    let image = null;

    // Save the new file to the uploads folder if provided
    if (req.file) {
      const uploadPath = path.join(__dirname, '../../uploads/third_categories');

      // Ensure the directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const imagePath = path.join(uploadPath, req.file.originalname);
      fs.writeFileSync(imagePath, req.file.buffer); // Save the image to the uploads folder
      image = `uploads/third_categories/${req.file.originalname}`; // Save relative path
    }

    const updatedData = {
      name,
      parentSubcategory,
      description,
      ...(image && { image }),
    };

    const updatedCategory = await ThirdCategory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: 'Third category not found' });
    }

    res.status(200).json({ success: true, thirdCategory: updatedCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a Third Category by ID
exports.deleteThirdCategory = async (req, res) => {
  try {
    const thirdCategory = await ThirdCategory.findById(req.params.id);

    if (!thirdCategory) {
      return res
        .status(404)
        .json({ success: false, message: 'Third category not found' });
    }

    // Delete the image from the uploads folder if it exists
    if (thirdCategory.image) {
      const imagePath = path.join(__dirname, '../../', thirdCategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    await thirdCategory.deleteOne();
    res
      .status(200)
      .json({ success: true, message: 'Third category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Third Categories by Subcategory ID
exports.getThirdCategoriesBySubcategoryId = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const thirdCategories = await ThirdCategory.find({
      parentSubcategory: subcategoryId,
    });

    if (!thirdCategories || thirdCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No third categories found for this subcategory',
      });
    }

    res.status(200).json({ success: true, thirdCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
