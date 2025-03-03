const Category = require('../../models/CATEGORIES/CategoriesSchema');
const path = require('path');
const fs = require('fs');

const os = require('os');

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Delete the file
  }
};

// exports.createCategory = async (req, res) => {
//   try {
//     const { name, description, metaTitle, metaDescription, metaKeywords } =
//       req.body;

//     // Check if an image file is uploaded
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'Image is required' });
//     }

//     console.log('Uploaded file:', req.file);

//     // Define the uploads directory
//     const uploadsDir = path.join(__dirname, '../../uploads/categories');

//     // Use a safe writable directory
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }

//     // Save the file in the uploads directory
//     const uniqueFilename = `${Date.now()}-${req.file.originalname}`;
//     const filePath = path.join(uploadsDir, uniqueFilename);

//     // Write the file to the directory
//     fs.writeFileSync(filePath, req.file.buffer);

//     // Save the relative path of the image to the database
//     const relativeFilePath = `uploads/categories/${uniqueFilename}`;

//     // Create and save the category document
//     const category = new Category({
//       name,
//       description,
//       image: relativeFilePath, // Save relative path to the database
//       metaTitle,
//       metaDescription,
//       metaKeywords: metaKeywords ? metaKeywords.split(',') : [],
//     });

//     const savedCategory = await category.save();

//     // Respond with success
//     res.status(201).json({
//       success: true,
//       message: 'Category created successfully',
//       category: savedCategory,
//     });
//   } catch (error) {
//     console.error('Error creating category:', error.message);

//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message,
//     });
//   }
// };

exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
      image,
    } = req.body;

    // if (!req.file || !req.image) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: 'Image is required' });
    // }

    if (!req.body.image) {
      return res
        .status(400)
        .json({ success: false, message: 'Image is required' });
    }

    // console.log('Uploaded file:', req.file);

    // Use /tmp/ instead of /var/task/uploads/categories/
    // const uploadsDir = path.join(os.tmpdir(), 'categories');

    // Ensure the directory exists
    // if (!fs.existsSync(uploadsDir)) {
    //   fs.mkdirSync(uploadsDir, { recursive: true });
    // }

    // Generate a unique filename
    // const uniqueFilename = `${Date.now()}-${req.file.originalname}`;
    // const filePath = path.join(uploadsDir, uniqueFilename);

    // Write the file to /tmp/
    // fs.writeFileSync(filePath, req.file.buffer);

    // console.log('File saved at:', filePath);

    // Save the temporary file path to the database
    // const relativeFilePath = `/tmp/categories/${uniqueFilename}`;

    // Create and save the category document
    const category = new Category({
      name,
      description,
      // image: relativeFilePath, // Store temp file path
      image: image, // Store temp file path
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywords,
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: savedCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
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
// exports.deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const category = await Category.findById(id);
//     if (!category) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Category not found' });
//     }

//     // Delete the image from local storage if it exists
//     if (category.image) {
//       deleteFile(path.join(__dirname, '../../', category.image));
//     }

//     await category.deleteOne();
//     res
//       .status(200)
//       .json({ success: true, message: 'Category deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting category:', error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }

    // Delete the image only if it's in the writable `/tmp/` directory
    if (category.image && category.image.startsWith('/tmp/')) {
      const imagePath = category.image;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Image deleted:', imagePath);
      }
    } else {
      console.log('Skipping image deletion (read-only file system)');
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
