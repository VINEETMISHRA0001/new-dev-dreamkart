const express = require('express');
const { saveSEO, getSEO } = require('../controllers/Seo');
const router = express.Router();

// Routes for SEO settings
router.get('/', getSEO); // Fetch SEO settings
router.post('/', saveSEO); // Save or update SEO settings

module.exports = router;
