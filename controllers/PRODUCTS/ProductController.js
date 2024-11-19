const cloudinary = require('../../config/Cloudinary');
const multer = require('./../../middlewares/MULTER/Multer');
const Product = require('./../../models/PRODUCTS/Products');
const AppError = require('./../../utils/AppError');
const Subcategory = require('./../../models/CATEGORIES/SubcategoriesSchema');
const CatchAsyncError = require('./../../utils/CatchAsyncErrorjs');
const xlsx = require('xlsx'); // Ensure you have the xlsx package installed

// Multer upload for image files
exports.uploadProductImage = multer.single('image');

// Create a new product
// exports.createProduct = CatchAsyncError(async (req, res, next) => {
//   const {
//     name,
//     category,
//     subcategory,
//     description,
//     price,
//     sizes,
//     colors,
//     fitShape,
//     manufacturer,
//     sizeChartImage,
//     pattern,
//     netWeight,
//     stock,
//     variations,
//   } = req.body;

//   // Validate required fields
//   if (!name || !category || !subcategory || !description || !price) {
//     return next(
//       new AppError(
//         "Name, category, subcategory, description, and price are required.",
//         400
//       )
//     );
//   }

//   // Check if the subcategory exists
//   const existingSubcategory = await Subcategory.findById(subcategory);
//   if (!existingSubcategory) {
//     return next(new AppError("Subcategory not found.", 404));
//   }

//   let imageUrl = null;
//   if (req.file) {
//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);
//     imageUrl = result.secure_url; // Set image URL if upload is successful
//     console.log("Uploaded image URL:", imageUrl); // Log the URL
//   } else {
//     console.log("No file uploaded."); // Log if no file is uploaded
//   }

//   // Prepare product data
//   const productData = {
//     name,
//     category,
//     subcategory,
//     description,
//     price,
//     stock: stock || 0,
//     image: imageUrl, // Use the uploaded image URL
//     createdBy: req.user._id, // Assumed to be set by your authentication middleware
//     sizes: sizes || [],
//     fitShape,
//     sizeChartImage,
//     manufacturer,
//     pattern,
//     netWeight,
//     colors: colors || [],
//     variations: variations || [], // Include variations from the request
//   };

//   const product = new Product(productData);
//   await product.save();

//   res.status(201).json({
//     status: "success",
//     data: {
//       product,
//     },
//   });
// });
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a product by ID
// exports.getProductById = CatchAsyncError(async (req, res, next) => {
//   const { id } = req.params;

//   const product = await Product.findById(id);
//   if (!product) {
//     return next(new AppError('Product not found.', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       product,
//     },
//   });
// });
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
// exports.updateProduct = CatchAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   const { name, description, price, sizes, colors, stock } = req.body;

//   // Validate required fields
//   if (!name || !description || !price) {
//     return next(
//       new AppError('Name, description, and price are required.', 400)
//     );
//   }

//   // Find the existing product
//   const existingProduct = await Product.findById(id);
//   if (!existingProduct) {
//     return next(new AppError('Product not found.', 404));
//   }

//   // Update product data
//   existingProduct.name = name;
//   existingProduct.description = description;
//   existingProduct.price = price;

//   // Maintain old stock if not provided
//   existingProduct.stock = stock !== undefined ? stock : existingProduct.stock;

//   // Preserve existing sizes and colors if not provided
//   existingProduct.sizes = sizes || existingProduct.sizes;
//   existingProduct.colors = colors || existingProduct.colors;

//   // Update image if a new one is uploaded
//   if (req.file) {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     existingProduct.image = result.secure_url; // Update image URL
//   }

//   // Save the updated product
//   await existingProduct.save();

//   // Return response with updated product
//   res.status(200).json({
//     status: 'success',
//     data: {
//       product: existingProduct,
//     },
//   });
// });
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
// exports.deleteProduct = CatchAsyncError(async (req, res, next) => {
//   const { id } = req.params;

//   const product = await Product.findByIdAndDelete(id);
//   if (!product) {
//     return next(new AppError('Product not found.', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     message: 'Product deleted successfully.',
//     data: null,
//   });
// });
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

// Download products route
exports.downloadProductsData = async (req, res) => {
  try {
    // Retrieve products from the database
    const products = await Product.find().populate('category subcategory');

    // Map the data to a format suitable for Excel
    const dataToExport = products.map((product) => ({
      Name: product.name,
      Category: product.category ? product.category.name : 'N/A', // Check for null
      Subcategory: product.subcategory ? product.subcategory.name : 'N/A', // Check for null
      Description: product.description,
      Price: product.price,
      Manufacturer: product.manufacturer,
      Sizes: JSON.stringify(product.sizes), // Convert array to string
      Colors: JSON.stringify(product.colors), // Convert array to string
      Image: product.image,
      Variations: JSON.stringify(product.variations), // Convert array to string
      FitShape: product.fitShape,
      SizeChartImage: product.sizeChartImage,
      Pattern: product.pattern,
      NetWeight: product.netWeight,
    }));

    // Create a new workbook and add the data
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Set the response header to indicate a file download
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // Write the Excel file to the response
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get all products
// exports.getAllProducts = CatchAsyncError(async (req, res, next) => {
//   // Optional: Populate category and subcategory for each product
//   const products = await Product.find().populate('category subcategory');

//   if (!products.length) {
//     return next(new AppError('No products found.', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     results: products.length,
//     data: {
//       products,
//     },
//   });
// });

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('thirdCategory');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products of a specific subcategory
exports.getProductsBySubcategory = CatchAsyncError(async (req, res, next) => {
  const { subcategoryId } = req.params;

  // Ensure subcategory exists
  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) {
    return next(new AppError('Subcategory not found.', 404));
  }

  // Fetch all products under this subcategory
  const products = await Product.find({ subcategory: subcategoryId }).populate(
    'category subcategory'
  );

  if (!products.length) {
    return next(new AppError('No products found for this subcategory.', 404));
  }

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

// GET PRODUCTS BY SUBCATEGORY
exports.getProductsBySubcategory = CatchAsyncError(async (req, res, next) => {
  const { subcategoryId } = req.params; // Fetch the subcategory ID from the request parameters

  // Find the subcategory to ensure it exists
  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) {
    return next(new AppError('Subcategory not found.', 404));
  }

  // Find all products associated with the subcategory
  const products = await Product.find({ subcategory: subcategoryId });

  res.status(200).json({
    status: 'success',
    data: products,
  });
});

// Product upload

exports.addProductsFromExcel = CatchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded.', 400));
  }

  const filePath = req.file.path;

  try {
    // Read and parse the uploaded Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const productsData = xlsx.utils.sheet_to_json(worksheet);

    // Validate if the Excel file contains data
    if (!productsData || productsData.length === 0) {
      return next(new AppError('Excel file contains no data.', 400));
    }

    // Initialize an array to hold products
    const productsToInsert = [];

    // Process each product in the Excel data
    for (const product of productsData) {
      // Check if the subcategory exists if provided
      if (product.Subcategory) {
        const subcategoryExists = await Subcategory.findById(
          product.Subcategory
        );
        if (!subcategoryExists) {
          throw new AppError(
            `Subcategory with ID ${product.Subcategory} not found.`,
            404
          );
        }
      }

      // Dynamically construct the product object based on fields present in the Excel data
      const productObject = {};

      // Add all fields from the Excel file directly to the productObject
      for (const key in product) {
        if (product.hasOwnProperty(key)) {
          productObject[key.toLowerCase()] = product[key];
        }
      }

      // Add product to the array for bulk insertion
      productsToInsert.push(productObject);
    }

    // Insert all products into the MongoDB collection
    await Product.insertMany(productsToInsert);

    // Send success response
    res.status(201).json({
      status: 'success',
      message: 'Products uploaded and inserted into the database successfully.',
      results: productsToInsert.length,
    });
  } catch (error) {
    return next(
      new AppError(`Failed to upload products: ${error.message}`, 500)
    );
  }
});
///////////////////// Seach ||  Filter || Pagination APi Query.... ////////////////////////////

exports.searchAndFilterProducts = CatchAsyncError(async (req, res, next) => {
  // Get query params for filters
  const {
    name,
    category,
    subcategory,
    minPrice,
    maxPrice,
    sizes,
    colors,
    fitShape,
    pattern,
    manufacturer,
    stockStatus,
    sortBy,
    page = 1,
    limit = 2,
  } = req.query;

  // Build MongoDB query object
  const queryObj = {};

  // Add filter for name (case-insensitive regex search)
  if (name) {
    queryObj.name = { $regex: name, $options: 'i' };
  }

  // Filter by category
  if (category) {
    queryObj.category = category;
  }

  // Filter by subcategory
  if (subcategory) {
    queryObj.subcategory = subcategory;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    queryObj.price = {};
    if (minPrice) {
      queryObj.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      queryObj.price.$lte = Number(maxPrice);
    }
  }

  // Filter by sizes (use $in operator to find any matching sizes)
  if (sizes) {
    queryObj.sizes = { $in: sizes.split(',') };
  }

  // Filter by colors (use $in operator to find any matching colors)
  if (colors) {
    queryObj.colors = { $in: colors.split(',') };
  }

  // Filter by fit shape
  if (fitShape) {
    queryObj.fitShape = fitShape;
  }

  // Filter by pattern
  if (pattern) {
    queryObj.pattern = pattern;
  }

  // Filter by manufacturer
  if (manufacturer) {
    queryObj.manufacturer = { $regex: manufacturer, $options: 'i' };
  }

  // Filter by stock status (either in-stock or out-of-stock)
  if (stockStatus) {
    if (stockStatus === 'in') {
      queryObj.stock = { $gt: 0 }; // In-stock products
    } else if (stockStatus === 'out') {
      queryObj.stock = { $eq: 0 }; // Out-of-stock products
    }
  }

  // Pagination setup
  const skip = (page - 1) * limit;

  // Sorting (default to newest first, but can sort by price, name, etc.)
  const sortOptions = {};
  if (sortBy) {
    const [sortField, sortOrder] = sortBy.split(':'); // e.g., "price:asc"
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default to sorting by newest products
  }

  // Fetch products from the database
  const products = await Product.find(queryObj)
    .populate('category subcategory')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  // Get total count of matched products for pagination purposes
  const totalProducts = await Product.countDocuments(queryObj);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total: totalProducts,
    currentPage: Number(page),
    totalPages: Math.ceil(totalProducts / limit),
    data: {
      products,
    },
  });
});

// GET PRODUCTS UNDER SPECIFIED PRICE
exports.getProductsUnderSpecifiedPrice = CatchAsyncError(
  async (req, res, next) => {
    const { maxPrice } = req.params;

    if (isNaN(maxPrice)) {
      return next(new AppError('Invalid price value', 400));
    }

    const priceLimit = parseFloat(maxPrice);

    const products = await Product.find({ price: { $lt: priceLimit } });

    if (!products || products.length === 0) {
      return next(new AppError(`No products found under ₹${priceLimit}`, 404));
    }

    res.status(200).json({
      status: 'success',
      totalProducts: products.length,
      products,
    });
  }
);

// get all brands
exports.getALlManufacturers = CatchAsyncError(async (req, res, next) => {
  try {
    const products = await Product.distinct('manufacturer');

    res.status(200).json({
      status: 'success',
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error); // Log the error for debugging
    return next(new AppError('Error fetching products.', 500));
  }
});

//DELETE A PRODUCT

exports.deleteProduct = CatchAsyncError(async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      data: deletedProduct, // Optional: Return the deleted product data if needed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});
