const Subcategory = require('../../models/CATEGORIES/SubcategoriesSchema');
const cloudinary = require('../../config/Cloudinary');

// Create Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, parentCategory, description } = req.body;
    let imageUrl = null;

    // Check if a file is provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'subcategories' }, // Upload to the 'subcategories' folder in Cloudinary
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

    // Create a new subcategory
    const subcategory = new Subcategory({
      name,
      parentCategory,
      description,
      image: imageUrl,
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
    let imageUrl = null;

    // Upload new image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'subcategories',
      });
      imageUrl = result.secure_url;
    }

    const updatedData = {
      name,
      parentCategory,
      description,
      ...(imageUrl && { image: imageUrl }),
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

    // Delete the image from Cloudinary if it exists
    if (subcategory.image) {
      const publicId = subcategory.image.split('/').pop().split('.')[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`subcategories/${publicId}`);
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
      return res.status(404).json({
        success: false,
        message: 'No subcategories found for this category',
      });
    }

    // Respond with the subcategories
    res.status(200).json({ success: true, subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
