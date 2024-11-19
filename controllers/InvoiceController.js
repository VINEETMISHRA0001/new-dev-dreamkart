// controllers/companyInfoController.js
const CompanyInfo = require('../models/InvoiceModel');

// Create or update company information
exports.saveCompanyInfo = async (req, res) => {
  try {
    const { gstEnabled, ...data } = req.body;

    if (gstEnabled && !data.gstNumber) {
      return res
        .status(400)
        .json({ error: 'GST number is required when GST is enabled.' });
    }

    let companyInfo = await CompanyInfo.findOne();
    if (companyInfo) {
      companyInfo = await CompanyInfo.findByIdAndUpdate(
        companyInfo._id,
        { gstEnabled, ...data },
        { new: true, runValidators: true }
      );
    } else {
      companyInfo = await CompanyInfo.create({ gstEnabled, ...data });
    }

    res.status(200).json(companyInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get company information
exports.getCompanyInfo = async (req, res) => {
  try {
    const companyInfo = await CompanyInfo.findOne();
    if (!companyInfo) {
      return res
        .status(404)
        .json({ message: 'Company information not found.' });
    }
    res.status(200).json(companyInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete company information
exports.deleteCompanyInfo = async (req, res) => {
  try {
    await CompanyInfo.deleteOne();
    res
      .status(200)
      .json({ message: 'Company information deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
