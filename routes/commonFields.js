// routes/commonFieldsRoutes.js
const express = require('express');
const { createCommonFields } = require('../controllers/commonFields');

const router = express.Router();

// Define routes
router.post('/', createCommonFields); // Create new common fields

module.exports = router;
