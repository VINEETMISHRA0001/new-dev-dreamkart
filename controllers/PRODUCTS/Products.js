const Product = require('../../models/PRODUCTS/Products');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const multer = require('multer');
const path = require('path');
const ThirdCategory = require('../../models/CATEGORIES/ThirdCategory');
const { default: slugify } = require('slugify');
const CategoriesSchema = require('../../models/CATEGORIES/CategoriesSchema');

// Multer configuration for file uploads

// Create a new product
// exports.createProduct = async (req, res) => {
//   try {
//     const productData = { ...req.body };

//     // Parse comboOf and images
//     if (req.body['Combo Of']) {
//       productData.comboOf = req.body['Combo Of'].split(',');
//     }
//     if (req.body['Images']) {
//       productData.images = req.body['Images'].split(',');
//     }

//     // Parse variations
//     // Handle variations (colors and sizes)
//     if (req.body.variations) {
//       try {
//         productData.variations =
//           typeof req.body.variations === 'string'
//             ? JSON.parse(req.body.variations)
//             : req.body.variations; // If already an object, assign directly
//       } catch (err) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid JSON format in 'variations'",
//           error: err.message,
//         });
//       }
//     }

//     // Validate required fields
//     if (!productData.name || !productData.price || !productData.thirdCategory) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields: name, price, or thirdCategory',
//       });
//     }

//     // Create and save the product
//     const product = new Product(productData);
//     await product.save();

//     res.status(201).json({ success: true, product });
//   } catch (error) {
//     console.error('Error in createProduct:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating product',
//       error: error.message,
//     });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    // Required fields validation
    const requiredFields = [
      'name',
      'mrp',
      'price',
      'inventory',
      'thirdCategory',
    ];

    const productData = req.body;
    const missingFields = requiredFields.filter((field) => !productData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missingFields.join(', ')}`,
      });
    }

    // Validate occasion
    const validOccasions = ['Haldi', 'Mehndi', 'Sangeet', 'Bridesmaid'];
    if (
      productData.styleByOccasion &&
      !validOccasions.includes(productData.styleByOccasion)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid occasion type. Allowed values: Haldi, Mehndi, Sangeet, Bridesmaid.',
      });
    }

    // Convert "isNewLaunch" to Boolean if provided
    if (productData.isNewLaunch !== undefined) {
      productData.isNewLaunch = productData.isNewLaunch === 'true';
    }

    // Handle file uploads
    if (req.files) {
      productData.images = req.files.map((file) =>
        file.buffer.toString('base64')
      );
    }

    // Save product
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product Created Successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('thirdCategory');

    // Map products to include stock status
    const updatedProducts = products.map((product) => ({
      ...product._doc, // Spread all existing fields of the product
      stockStatus: product.inventory < 1 ? 'Out of Stock' : 'In Stock',
    }));

    res.status(200).json({ success: true, products: updatedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get products by category name
exports.getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: 'Category ID is required' });
    }

    // Fetch products that belong to the specified category ID
    const products = await Product.find({ category: categoryId }).populate(
      'category'
    );

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No products found for this category',
      });
    }

    // Map products to include stock status
    const updatedProducts = products.map((product) => ({
      ...product._doc, // Spread all existing fields of the product
      stockStatus: product.inventory < 1 ? 'Out of Stock' : 'In Stock',
    }));

    res.status(200).json({ success: true, products: updatedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNewLaunch: true }).populate(
      'thirdCategory'
    );

    // Map products to include stock status
    const updatedProducts = products.map((product) => ({
      ...product._doc, // Spread all existing fields of the product
      stockStatus: product.inventory < 1 ? 'Out of Stock' : 'In Stock',
    }));

    res.status(200).json({ success: true, products: updatedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products by occassion
exports.getByOccassion = async (req, res) => {
  try {
    const { occasion, newLaunch } = req.query;
    let filter = {};

    if (occasion) {
      filter.styleByOccasion = occasion;
    }

    if (newLaunch === 'true') {
      filter.isNewLaunch = true;
    }

    const products = await Product.find(filter);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('thirdCategory');
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateErrorReport = (errors, res) => {
  // Create a workbook and a sheet with the error details
  const errorData = [
    ['Row Number', 'Error Details'], // Header row
    ...errors.map((error) => [error.row, error.errors]), // Map errors to rows
  ];

  const ws = xlsx.utils.aoa_to_sheet(errorData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Errors');

  // Generate the Excel file in memory
  const fileBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

  // Set the response headers to trigger a download
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=error_report.xlsx'
  );
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  // Send the file buffer as the response
  res.end(fileBuffer);
};

exports.excelUploadController = async (req, res) => {
  try {
    const { thirdCategory } = req.body;
    const file = req.file; // File uploaded using Multer

    // Validate request
    if (!thirdCategory) {
      return res.status(400).json({ message: 'Third category is required.' });
    }
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Read Excel file from buffer
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetData = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    // Validate category existence
    const category = await ThirdCategory.findById(thirdCategory);
    if (!category) {
      return res.status(400).json({ message: 'Invalid third category ID.' });
    }

    const errors = [];
    const validProducts = [];

    for (const [index, row] of sheetData.entries()) {
      const errorMessages = [];

      // Validate required fields
      if (!row['SKU_ID']) errorMessages.push('SKU_ID is required');
      if (!row['Product Name']) errorMessages.push('Product Name is required');
      if (!row['Price'] || isNaN(row['Price']))
        errorMessages.push('Price must be a valid number');
      if (!row['MRP'] || isNaN(row['MRP']))
        errorMessages.push('MRP must be a valid number');

      if (errorMessages.length > 0) {
        errors.push({ row: index + 2, errors: errorMessages.join(', ') });
        continue;
      }

      // Check for existing SKU
      const existingProduct = await Product.findOne({ skuId: row['SKU_ID'] });
      if (existingProduct) {
        errors.push({
          row: index + 2,
          errors: `SKU_ID "${row['SKU_ID']}" already exists.`,
        });
        continue;
      }

      // Generate a unique slug
      const slug = slugify(row['Product Name'], { lower: true, strict: true });

      // Prepare product data
      const productData = {
        name: row['Product Name'],
        shortDescription: row['Short Description'] || '',
        longDescription: row['Long Description'] || '',
        mrp: parseFloat(row['MRP']),
        price: parseFloat(row['Price']),
        discount: parseFloat(row['Discount']) || 0,
        gst: parseFloat(row['GST']) || 0,
        inventory: parseInt(row['Inventory'], 10) || 0,
        comboOf: row['Combo Of']
          ? row['Combo Of'].split(',').map((c) => c.trim())
          : [],
        stitchType: row['Stitch Type'] || '',
        fabric: row['Fabric'] || '',
        length: row['Length'] || '',
        neck: row['Neck'] || '',
        occasion: row['Occasion'] || '',
        styleByOccasion: row['styleByOccasion'] || '',
        pattern: row['Pattern'] || '',
        sleeveLength: row['Sleeve Length'] || '',
        fitType: row['Fit Type'] || '',
        weight: parseFloat(row['Weight']) || 0,
        bustSize: parseFloat(row['Bust Size']) || 0,
        waistSize: parseFloat(row['Waist Size']) || 0,
        hipSize: parseFloat(row['Hip Size']) || 0,
        washingCare: row['Washing Care'] || '',
        closureType: row['Closure Type'] || '',
        embellishments: row['Embellishments']
          ? row['Embellishments'].split(',').map((e) => e.trim())
          : [],
        thirdCategory,
        countryOfOrigin: row['Country of Origin'] || 'India',
        careInstructions: row['Care Instructions'] || '',
        images: row['Images']
          ? row['Images'].split(',').map((img) => img.trim())
          : [],
        videos: row['Videos']
          ? row['Videos'].split(',').map((vid) => vid.trim())
          : [],
        variations: row['Variations (JSON)']
          ? JSON.parse(row['Variations (JSON)'])
          : [],
        skuId: row['SKU_ID'],
        seoTitle: row['SEO Title'] || '',
        seoDescription: row['SEO Description'] || '',
        seoKeywords: row['SEO Keywords']
          ? row['SEO Keywords'].split(',').map((kw) => kw.trim())
          : [],
        slug,
      };

      validProducts.push(productData);
    }

    // If errors exist, return response with errors
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: 'Validation errors found.', errors });
    }

    // Bulk insert valid products
    if (validProducts.length > 0) {
      await Product.insertMany(validProducts);
      return res
        .status(201)
        .json({ message: 'Products uploaded successfully.' });
    } else {
      return res.status(400).json({ message: 'No valid products to upload.' });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || 'Error uploading products.' });
  }
};

// Helper to generate unique slugs
const generateUniqueSlug = async (name) => {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await Product.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

// Apply Discounts
exports.applyDiscountToCategory = async (req, res) => {
  try {
    const { thirdCategoryId, discount } = req.body;

    // Validate inputs
    if (!thirdCategoryId || discount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'thirdCategoryId and discount are required',
      });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: 'Discount must be between 0 and 100%',
      });
    }

    // Check if the thirdCategory exists
    const thirdCategory = await ThirdCategory.findById(thirdCategoryId);
    if (!thirdCategory) {
      return res.status(404).json({
        success: false,
        message: 'thirdCategory not found',
      });
    }

    // Find products in the thirdCategory
    const products = await Product.find({ thirdCategory: thirdCategoryId });

    // Update prices and apply discounts
    const updates = await Promise.all(
      products.map(async (product) => {
        const discountedPrice =
          product.price - (product.price * discount) / 100;
        return Product.findByIdAndUpdate(
          product._id,
          {
            $set: {
              discount,
              price: discountedPrice.toFixed(2), // Optionally round off the price
            },
          },
          { new: true } // Return the updated document
        );
      })
    );

    res.status(200).json({
      success: true,
      message: 'Discount applied successfully, prices updated',
      updatedProducts: updates,
    });
  } catch (error) {
    console.error('Error in applyDiscountToCategory:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error applying discount and updating prices',
      error: error.message,
    });
  }
};

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// const Product = require('../../models/PRODUCTS/Products');
// const xlsx = require('xlsx');
// const ThirdCategory = require('../../models/CATEGORIES/ThirdCategory');

// // Create a new product
// exports.createProduct = async (req, res) => {
//   try {
//     const productData = { ...req.body };

//     // Parse comboOf and images
//     if (req.body.comboOf) {
//       productData.comboOf = req.body.comboOf.split(',');
//     }
//     if (req.body.images) {
//       productData.images = req.body.images.split(',');
//     }

//     // Parse variations (if provided as JSON string)
//     if (req.body.variations) {
//       try {
//         productData.variations =
//           typeof req.body.variations === 'string'
//             ? JSON.parse(req.body.variations)
//             : req.body.variations;
//       } catch (err) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid JSON format in 'variations'",
//           error: err.message,
//         });
//       }
//     }

//     // Validate required fields
//     const { name, price, thirdCategory } = productData;
//     if (!name || !price || !thirdCategory) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields: name, price, or thirdCategory',
//       });
//     }

//     // Create and save the product
//     const product = new Product(productData);
//     await product.save();

//     res.status(201).json({ success: true, product });
//   } catch (error) {
//     console.error('Error in createProduct:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating product',
//       error: error.message,
//     });
//   }
// };

// // Get all products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('thirdCategory');
//     const updatedProducts = products.map((product) => ({
//       ...product._doc,
//       stockStatus: product.inventory < 1 ? 'Out of Stock' : 'In Stock',
//     }));

//     res.status(200).json({ success: true, products: updatedProducts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get a product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id).populate('thirdCategory');
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Product not found' });
//     }
//     res.status(200).json({ success: true, product });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update a product by ID
// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedProduct) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Product not found' });
//     }
//     res.status(200).json({ success: true, updatedProduct });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete a product by ID
// exports.deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedProduct = await Product.findByIdAndDelete(id);
//     if (!deletedProduct) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Product not found' });
//     }
//     res
//       .status(200)
//       .json({ success: true, message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Apply discounts to a category
// exports.applyDiscountToCategory = async (req, res) => {
//   try {
//     const { thirdCategoryId, discount } = req.body;

//     // Validate inputs
//     if (!thirdCategoryId || discount === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: 'thirdCategoryId and discount are required',
//       });
//     }
//     if (discount < 0 || discount > 100) {
//       return res.status(400).json({
//         success: false,
//         message: 'Discount must be between 0 and 100%',
//       });
//     }

//     // Check if the category exists
//     const category = await ThirdCategory.findById(thirdCategoryId);
//     if (!category) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Category not found' });
//     }

//     // Find and update products
//     const products = await Product.find({ thirdCategory: thirdCategoryId });
//     const updates = await Promise.all(
//       products.map(async (product) => {
//         const discountedPrice =
//           product.price - (product.price * discount) / 100;
//         return Product.findByIdAndUpdate(
//           product._id,
//           {
//             $set: {
//               discount,
//               price: discountedPrice.toFixed(2),
//             },
//           },
//           { new: true }
//         );
//       })
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Discount applied successfully',
//       updatedProducts: updates,
//     });
//   } catch (error) {
//     console.error('Error in applyDiscountToCategory:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Error applying discount',
//       error: error.message,
//     });
//   }
// };

// // Helper to generate unique slugs
// const generateUniqueSlug = async (name) => {
//   const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
//   let uniqueSlug = baseSlug;
//   let counter = 1;

//   while (await Product.exists({ slug: uniqueSlug })) {
//     uniqueSlug = `${baseSlug}-${counter}`;
//     counter++;
//   }

//   return uniqueSlug;
// };
