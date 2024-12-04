const Product = require('../../models/PRODUCTS/ProductSchema');
const cloudinary = require('../../config/Cloudinary');

const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /xlsx|xls/; // Allow only Excel files
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// CREATE a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      longDescription,
      styleId,
      price,
      discount,
      gst,
      hsnCode,
      size,
      attributes,
      stockQuantity,
      inventory,
      comboOf,
      stitchType,
      length,
      neck,
      occasion,
      ornamentation,
      pattern,
      sleeveLength,
      sleeveStyling,
      bustSize,
      shoulderSize,
      waistSize,
      hipSize,
      weight,
      thirdCategory,
      countryOfOrigin,
      manufacturerDetails,
      packerDetails,
      importerDetails,
    } = req.body;

    let imageUrls = [];
    if (req.files) {
      // Upload images to Cloudinary
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: 'products' })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.secure_url);
    }

    const product = new Product({
      name,
      shortDescription,
      longDescription,
      styleId,
      price,
      discount,
      gst,
      hsnCode,
      size,
      attributes: JSON.parse(attributes || '{}'), // Parse stringified attributes if provided
      stockQuantity,
      inventory,
      comboOf: comboOf ? comboOf.split(',') : [], // Convert comma-separated values into an array
      stitchType,
      length,
      neck,
      occasion,
      ornamentation,
      pattern,
      sleeveLength,
      sleeveStyling,
      bustSize,
      shoulderSize,
      waistSize,
      hipSize,
      weight,
      thirdCategory,
      countryOfOrigin,
      manufacturerDetails,
      packerDetails,
      importerDetails,
      images: imageUrls,
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// READ all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('thirdCategory');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ a specific product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'thirdCategory'
    );
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

// UPDATE a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      longDescription,
      styleId,
      price,
      discount,
      gst,
      hsnCode,
      size,
      attributes,
      stockQuantity,
      inventory,
      comboOf,
      stitchType,
      length,
      neck,
      occasion,
      ornamentation,
      pattern,
      sleeveLength,
      sleeveStyling,
      bustSize,
      shoulderSize,
      waistSize,
      hipSize,
      weight,
      thirdCategory,
      countryOfOrigin,
      manufacturerDetails,
      packerDetails,
      importerDetails,
    } = req.body;

    let imageUrls = [];
    if (req.files) {
      // Upload new images to Cloudinary
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: 'products' })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.secure_url);
    }

    const updatedData = {
      name,
      shortDescription,
      longDescription,
      styleId,
      price,
      discount,
      gst,
      hsnCode,
      size,
      attributes: attributes ? JSON.parse(attributes) : undefined,
      stockQuantity,
      inventory,
      comboOf: comboOf ? comboOf.split(',') : undefined,
      stitchType,
      length,
      neck,
      occasion,
      ornamentation,
      pattern,
      sleeveLength,
      sleeveStyling,
      bustSize,
      shoulderSize,
      waistSize,
      hipSize,
      weight,
      thirdCategory,
      countryOfOrigin,
      manufacturerDetails,
      packerDetails,
      importerDetails,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((url) => {
        const publicId = url.split('/').pop().split('.')[0]; // Extract public ID from URL
        return cloudinary.uploader.destroy(`products/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    await product.remove();
    res
      .status(200)
      .json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = upload;
