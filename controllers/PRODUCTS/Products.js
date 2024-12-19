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

    if (!thirdCategory) {
      return res.status(400).json({ message: 'Third category is required.' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' }); // Reading from buffer
    const sheetData = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    const category = await ThirdCategory.findById(thirdCategory);
    if (!category) {
      return res.status(400).json({ message: 'Invalid third category ID.' });
    }

    const errors = [];
    const validProducts = [];

    for (const [index, row] of sheetData.entries()) {
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

      // Skip if errors found
      if (errorMessages.length > 0) {
        errors.push({ row: index + 2, errors: errorMessages.join(', ') });
        continue;
      }

      // Check if SKU_ID already exists
      const existingProduct = await Product.findOne({
        skuId: row['SKU_ID'],
      });

      if (existingProduct) {
        errors.push({
          row: index + 2,
          errors: `SKU_ID "${row['SKU_ID']}" already exists.`,
        });
        continue;
      }

      // Generate slug for the product (await the result)
      const slug = await generateUniqueSlug(row['Product Name']);

      // Prepare product data
      const productData = {
        name: row['Product Name'],
        shortDescription: row['Short Description'] || '',
        longDescription: row['Long Description'] || '',
        styleId: row['Style ID'] || '',
        price: parseFloat(row['Price']),
        discount: parseFloat(row['Discount']) || 0,
        gst: parseFloat(row['GST']) || 0,
        hsnCode: row['HSN Code'] || '',
        inventory: parseInt(row['Inventory'], 10) || 0,
        comboOf: row['Combo Of']
          ? row['Combo Of'].split(',').map((c) => c.trim())
          : [],
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
        thirdCategory,
        countryOfOrigin: row['Country of Origin'] || 'India',
        manufacturerDetails: row['Manufacturer Details'] || '',
        packerDetails: row['Packer Details'] || '',
        importerDetails: row['Importer Details'] || '',
        images: row['Images']
          ? row['Images'].split(',').map((img) => img.trim())
          : [],
        variations: row['Variations'] ? JSON.parse(row['Variations']) : [],
        skuId: row['SKU_ID'],
        seoTitle: row['SEO Title'] || '',
        seoDescription: row['SEO Description'] || '',
        seoKeywords: row['SEO Keywords']
          ? row['SEO Keywords'].split(',').map((kw) => kw.trim())
          : [],
        slug, // Ensure slug is generated uniquely
      };

      validProducts.push(productData);
    }

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
