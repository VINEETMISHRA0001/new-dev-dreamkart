const Product = require('../../models/PRODUCTS/Products');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const multer = require('multer');
const path = require('path');
const ThirdCategory = require('../../models/CATEGORIES/ThirdCategory');

// Multer configuration for file uploads

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Parse comboOf and images
    if (req.body['Combo Of']) {
      productData.comboOf = req.body['Combo Of'].split(',');
    }
    if (req.body['Images']) {
      productData.images = req.body['Images'].split(',');
    }

    // Parse variations
    // Handle variations (colors and sizes)
    if (req.body.variations) {
      try {
        productData.variations =
          typeof req.body.variations === 'string'
            ? JSON.parse(req.body.variations)
            : req.body.variations; // If already an object, assign directly
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in 'variations'",
          error: err.message,
        });
      }
    }

    // Validate required fields
    if (!productData.name || !productData.price || !productData.thirdCategory) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, or thirdCategory',
      });
    }

    // Create and save the product
    const product = new Product(productData);
    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error in createProduct:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('thirdCategory');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

exports.excelUploadController = async (req, res) => {
  try {
    const { thirdCategory } = req.body; // Selected third category ID
    const file = req.file; // The file sent by multer

    // Check if thirdCategory and file exist
    if (!thirdCategory) {
      return res.status(400).json({ message: 'Third category is required.' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Read the Excel file
    const workbook = xlsx.read(file.buffer, { type: 'buffer' }); // Reading from buffer
    const sheetData = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    // Ensure the third category exists
    const category = await ThirdCategory.findById(thirdCategory);
    if (!category) {
      return res.status(400).json({ message: 'Invalid third category ID.' });
    }

    // Prepare arrays for storing valid products and errors
    const errors = []; // Array to store error details
    const validProducts = []; // Array to store valid products

    // Process each product row in the Excel file
    sheetData.forEach((row, index) => {
      const errorMessages = [];

      // Check for required fields (e.g., SKU_ID)
      if (!row['SKU_ID']) {
        errorMessages.push('SKU_ID is required');
      }
      if (!row['Product Name']) {
        errorMessages.push('Product Name is required');
      }
      if (!row['Price'] || isNaN(row['Price'])) {
        errorMessages.push('Price is required and must be a number');
      }

      // If errors exist for this row, log the error
      if (errorMessages.length > 0) {
        errors.push({
          row: index + 2, // Row number (considering headers in row 1)
          errors: errorMessages.join(', '),
        });
      } else {
        // Construct the product object based on the Excel data
        const product = {
          skuId: row['SKU_ID'],
          name: row['Product Name'] || 'Unnamed Product',
          price: parseFloat(row['Price']) || 0,
          shortDescription: row['Short Description'] || '',
          longDescription: row['Long Description'] || '',
          category: thirdCategory,
          // Additional fields like images, variations, etc.
        };

        validProducts.push(product); // Add valid product to array
      }
    });

    // If there are any errors, generate and send an error Excel file
    if (errors.length > 0) {
      return generateErrorReport(errors, res); // Stop further processing and return error file
    }

    // If there are valid products, insert them into the database
    if (validProducts.length > 0) {
      await Product.insertMany(validProducts); // Insert the valid products into DB
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
// Function to generate Excel error report
const generateErrorReport = (errors, res) => {
  // Convert errors array to a sheet
  const errorWorksheet = xlsx.utils.json_to_sheet(errors, {
    header: ['Row', 'Errors'],
  });

  // Create a new workbook for errors
  const errorWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(errorWorkbook, errorWorksheet, 'Errors');

  // Generate the Excel file
  const excelFile = xlsx.write(errorWorkbook, {
    bookType: 'xlsx',
    type: 'buffer',
  });

  // Set the response headers for downloading the file
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=upload_errors.xlsx'
  );
  res.send(excelFile);
};
