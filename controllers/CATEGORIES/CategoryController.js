const Category = require('../../models/CATEGORIES/CategoriesSchema');
const cloudinary = require('../../config/Cloudinary');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, description } = req.body;
    let imageUrl = null;

    if (req.file) {
      console.log('Uploading file to Cloudinary...');
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'category-images' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer); // For memory storage
      });
      imageUrl = result.secure_url;
      console.log('Uploaded file URL:', imageUrl);
    }

    const category = new Category({ name, description, image: imageUrl });
    const savedCategory = await category.save();
    console.log('Saved category:', savedCategory);

    res.status(201).json({ success: true, category: savedCategory });
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
    const { name, description } = req.body;
    let imageUrl = null;

    // Upload new image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'categories',
      });
      imageUrl = result.secure_url;
    }

    const updatedData = {
      name,
      description,
      ...(imageUrl && { image: imageUrl }),
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({ success: true, updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category to delete
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }

    // Delete the image from Cloudinary if it exists
    if (category.image) {
      const publicId = category.image.split('/').pop().split('.')[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }

    await category.deleteOne();
    res
      .status(200)
      .json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
