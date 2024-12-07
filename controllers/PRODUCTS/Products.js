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
    const { thirdCategory } = req.body; // Selected third category ID
    const file = req.file; // The file sent by multer

    // Check if thirdCategory and file exist
    if (!thirdCategory) {
      return res.status(400).json({ message: 'Third category is required.' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // If using memory storage, file will be in buffer instead of path
    const workbook = xlsx.read(file.buffer, { type: 'buffer' }); // Reading from buffer
    const sheetData = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    // Ensure the third category exists
    const category = await ThirdCategory.findById(thirdCategory);
    if (!category) {
      return res.status(400).json({ message: 'Invalid third category ID.' });
    }

    // Process each product row in the Excel file
    const errors = [];
    const validProducts = [];

    sheetData.forEach((row, index) => {
      const errorMessages = [];

      // Validate required fields
      if (!row['SKU_ID']) {
        errorMessages.push('SKU_ID is required');
      }
      if (!row['Product Name']) {
        errorMessages.push('Product Name is required');
      }
      if (!row['Price'] || isNaN(row['Price'])) {
        errorMessages.push('Price is required and must be a valid number');
      }

      if (!row['Short Description']) {
        errorMessages.push('Short Description is required');
      }
      if (!row['Long Description']) {
        errorMessages.push('Long Description is required');
      }

      // If there are any error messages, add them to the errors array
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
          shortDescription: row['Short Description'] || '',
          longDescription: row['Long Description'] || '',
          styleId: row['Style ID'] || '',
          price: parseFloat(row['Price']) || 0,
          discount: parseFloat(row['Discount']) || 0,
          gst: parseFloat(row['GST']) || 0,
          hsnCode: row['HSN Code'] || '',
          stitchType: row['Stitch Type'] || '',
          length: row['Length'] || '',
          neck: row['Neck'] || '',
          occasion: row['Occasion'] || '',
          ornamentation: row['Ornamentation'] || '',
          pattern: row['Pattern'] || '',
          sleeveLength: row['Sleeve Length'] || '',
          sleeveStyling: row['Sleeve Styling'] || '',
          weight: parseFloat(row['Weight']) || 0,
          bustSize: parseFloat(row['Bust Size']) || 0,
          shoulderSize: parseFloat(row['Shoulder Size']) || 0,
          waistSize: parseFloat(row['Waist Size']) || 0,
          hipSize: parseFloat(row['Hip Size']) || 0,
          thirdCategory, // Store third category ID
          countryOfOrigin: row['Country of Origin'] || 'India', // Default to 'India' if not provided
          manufacturerDetails: row['Manufacturer Details'] || '',
          packerDetails: row['Packer Details'] || '',
          importerDetails: row['Importer Details'] || '',
          images: row['Images']
            ? row['Images'].split(',').map((img) => img.trim())
            : [],
          variations: [
            {
              color: row['Variations (Color)'] || '',
              colorImages: row['Variations (Color Images)']
                ? row['Variations (Color Images)']
                    .split(',')
                    .map((img) => img.trim())
                : [],
              sizes: [
                {
                  size: row['Variations (Size)'] || '',
                  inventory: parseInt(row['Variations (Inventory)'], 10) || 0,
                },
              ],
            },
          ],
          seoTitle: row['SEO Title'] || '',
          seoDescription: row['SEO Description'] || '',
          seoKeywords: row['SEO Keywords']
            ? row['SEO Keywords'].split(',').map((kw) => kw.trim())
            : [],
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
