// const express = require("express");
// const {
//   authenticateAdmin,
// } = require("../../middlewares/Admin/AuthenticateAdmin");

// const {
//   createProduct,
//   getProductById,
//   updateProduct,
//   downloadProductsData,
//   getAllProducts,
//   getProductsBySubcategory,
//   addProductsFromExcel,
//   searchAndFilterProducts,
//   getProductsUnderSpecifiedPrice,
//   getALlManufacturers,
//   deleteProduct,
// } = require("../../controllers/PRODUCTS/ProductController");
// // const upload = require("../../middlewares/MULTER/Multer");
// const upload = require("./../../uploads/multer");
// const { addToRecentlyViewed } = require("../../controllers/ProfileController");
// const authenticateUser = require("../../middlewares/AuthMiddleware");
// const {
//   uploadExcel,
//   uploadExcelFile,
// } = require("../../controllers/PRODUCTS/ProductExcellController");

// const router = express.Router();

// router.get("/download", downloadProductsData);
// router.get("/brands", getALlManufacturers);
// // Route for creating a product with image upload
// router.post(
//   "/create",
//   authenticateAdmin,
//   upload.single("image"),
//   createProduct
// ); // Protecting the route and handling file upload

// router.get("/advanced-search", searchAndFilterProducts);

// router.get("/under/:maxPrice", getProductsUnderSpecifiedPrice);

// router.post("/recently-viewed", authenticateUser, addToRecentlyViewed);

// router.get("/", getAllProducts);

// router.get("/:id", getProductById);

// // Route for updating a product by ID
// router.patch("/:id", authenticateAdmin, upload.single("image"), updateProduct);

// router.get("/subcategory/:subcategoryId", getProductsBySubcategory);

// // Route for deleting a product by ID
// router.delete("/:id", authenticateAdmin, deleteProduct);

// // search - query

// router.post(
//   "/upload-products",
//   authenticateAdmin,
//   uploadExcelFile,
//   uploadExcel
// );

// module.exports = router;

////////////////// ******* //////// ********** ///////////////

const express = require('express');
const productController = require('../../controllers/PRODUCTS/Products'); // Adjust path as needed
const upload = require('../../middlewares/MULTER/newMulter');
// const newupload = require('../../controllers/PRODUCTS/Products');
const uploadExcel = require('../../newExcell');
const Product = require('../../models/PRODUCTS/Products');

const router = express.Router();

// Create a new product
router.post('/', upload.array('images', 5), productController.createProduct);
router.post('/apply-discount', productController.applyDiscountToCategory);
router.post(
  '/excell-upload',
  uploadExcel.single('file'),
  productController.excelUploadController
);
// Get all products
router.get('/', productController.getAllProducts);
router.get('/new', productController.getNewProducts);
router.get('/festive', productController.getByOccassion);
router.get('/grouped/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from params

    // Check if ID is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    // Find similar products based on category, fabric, pattern, and occasion
    const similarProducts = await Product.find({
      _id: { $ne: product._id }, // Exclude the current product
      thirdCategory: product.thirdCategory,
      fabric: product.fabric,
      pattern: product.pattern,
      occasion: product.occasion,
    });

    res.json({ success: true, product, similarProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a product by ID
router.get('/:id', productController.getProductById);

// Update a product by ID
router.put('/:id', upload.array('images', 5), productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
