const express = require('express');
const {
  addAddress,
  editAddress,
  viewAddresses,
  deleteAddress,
} = require('./../controllers/AdressController');
const authenticateUser = require('../middlewares/AuthMiddleware');
// const { protect } = require("./../middlewares/Protect"); // Ensure user is authenticated

const router = express.Router();

// Routes for Address
router.post('/add', authenticateUser, addAddress); // Add address
router.post('/edit/:addressId', authenticateUser, editAddress); // Edit address by ID
router.get('/view', authenticateUser, viewAddresses); // View all addresses
router.delete('/delete/:addressId', authenticateUser, deleteAddress); // View all addresses

module.exports = router;
