// routes/companyInfoRoutes.js
const express = require('express');
const router = express.Router();
const companyInfoController = require('../controllers/InvoiceController');

router.get('/company-info', companyInfoController.getCompanyInfo);
router.post('/company-info', companyInfoController.saveCompanyInfo);
router.delete('/company-info', companyInfoController.deleteCompanyInfo);

module.exports = router;
