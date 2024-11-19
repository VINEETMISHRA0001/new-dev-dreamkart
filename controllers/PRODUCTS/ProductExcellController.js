const multer = require("multer");
const XLSX = require("xlsx");
const mongoose = require("mongoose");
const Product = require("../../models/PRODUCTS/ProductsSchema");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to parse and validate Excel data
const parseExcelData = (worksheet) => {
  const data = XLSX.utils.sheet_to_json(worksheet);
  const parsedData = [];

  data.forEach((row) => {
    // Basic field validation
    if (!row.name || !row.category || !row.subcategory || !row.price) {
      return; // Skip rows with missing required fields
    }

    // Validate `createdBy` field to be a valid ObjectId or set to null
    let createdBy =
      row.createdBy && mongoose.Types.ObjectId.isValid(row.createdBy)
        ? row.createdBy
        : null;

    // Prepare product data object
    const productData = {
      name: row.name,
      category: row.category,
      subcategory: row.subcategory,
      description: row.description || "",
      price: row.price,
      manufacturer: row.manufacturer || "",
      material: row.material || "",
      fabricCare: row.fabricCare || "",
      stock: row.stock || 0,
      // Trim whitespace in sizes and colors
      sizes: row.sizes ? row.sizes.split(",").map((size) => size.trim()) : [],
      colors: row.colors
        ? row.colors.split(",").map((color) => color.trim())
        : [],
      fit: row.fit || "",
      sizeChartImage: row.sizeChartImage || "",
      pattern: row.pattern || "",
      netWeight: row.netWeight || 0,
      productDimensions: {
        length: row.length || 0,
        width: row.width || 0,
        height: row.height || 0,
      },
      variations: row.variations ? JSON.parse(row.variations) : [],
      createdBy: createdBy,
      // Handle images - assuming row.images is a JSON string
      images: row.images ? JSON.parse(row.images) : [], // Assuming images is a JSON string in Excel
    };

    parsedData.push(productData);
  });

  return parsedData;
};

// Excel upload handler
const uploadExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    // Parse Excel file
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const productsData = parseExcelData(worksheet);

    // Insert validated data into the database
    const createdProducts = await Product.insertMany(productsData);

    return res.status(201).json({
      message: "Products uploaded successfully.",
      data: createdProducts,
    });
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware for Excel file upload route
const uploadExcelFile = upload.single("file");

module.exports = { uploadExcelFile, uploadExcel };
