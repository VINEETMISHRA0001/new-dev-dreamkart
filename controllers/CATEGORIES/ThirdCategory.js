const ThirdCategory = require('../../models/CATEGORIES/ThirdCategory');
const cloudinary = require('../../config/Cloudinary');

exports.createThirdCategory = async (req, res) => {
  try {
    const { name, parentSubcategory, description } = req.body;
    let imageUrl = null;

    // Check if a file is provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'third_categories' }, // Upload to the 'third_categories' folder in Cloudinary
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer); // Pass the file buffer to Cloudinary
      });
      imageUrl = result.secure_url; // Save the uploaded image URL
    }

    // Create a new third category
    const thirdCategory = new ThirdCategory({
      name,
      parentSubcategory,
      description,
      image: imageUrl,
    });

    // Save to the database
    const savedCategory = await thirdCategory.save();
    res.status(201).json({ success: true, thirdCategory: savedCategory });
  } catch (error) {
    console.error('Error creating third category:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ all third categories
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

// READ a specific third category by ID
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

// UPDATE a third category by ID
exports.updateThirdCategory = async (req, res) => {
  try {
    const { name, parentSubcategory, description } = req.body;
    let imageUrl = null;

    // Upload a new image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'third_categories',
      });
      imageUrl = result.secure_url;
    }

    const updatedData = {
      name,
      parentSubcategory,
      description,
      ...(imageUrl && { image: imageUrl }),
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

// DELETE a third category by ID
exports.deleteThirdCategory = async (req, res) => {
  try {
    const thirdCategory = await ThirdCategory.findById(req.params.id);

    if (!thirdCategory) {
      return res
        .status(404)
        .json({ success: false, message: 'Third category not found' });
    }

    // Delete the image from Cloudinary if it exists
    if (thirdCategory.image) {
      const publicId = thirdCategory.image.split('/').pop().split('.')[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`third_categories/${publicId}`);
    }

    await thirdCategory.deleteOne();
    res
      .status(200)
      .json({ success: true, message: 'Third category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getThirdCategoriesBySubcategoryId = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    // Find third categories that belong to the given subcategory
    const thirdCategories = await ThirdCategory.find({
      parentSubcategory: subcategoryId,
    });

    // Check if no third categories are found
    if (!thirdCategories || thirdCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No third categories found for this subcategory',
      });
    }

    // Respond with the found third categories
    res.status(200).json({
      success: true,
      thirdCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
