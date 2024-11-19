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

const router = express.Router();

// Create a new product
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:id', productController.getProductById);

// Update a product by ID
router.put('/:id', productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
