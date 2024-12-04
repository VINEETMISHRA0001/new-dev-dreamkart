const SEO = require('../models/Seo');

// Create or Update SEO Settings
exports.saveSEO = async (req, res) => {
  try {
    const {
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalURL,
      structuredData,
    } = req.body;

    // Check if an SEO entry already exists
    let seoEntry = await SEO.findOne();
    if (seoEntry) {
      // Update existing entry
      seoEntry = await SEO.findByIdAndUpdate(
        seoEntry._id,
        {
          metaTitle,
          metaDescription,
          metaKeywords,
          canonicalURL,
          structuredData,
        },
        { new: true } // Return the updated document
      );
    } else {
      // Create a new entry
      seoEntry = await SEO.create({
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalURL,
        structuredData,
      });
    }

    res
      .status(200)
      .json({ message: 'SEO data saved successfully', seo: seoEntry });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to save SEO data', error: error.message });
  }
};

// Get SEO Settings
exports.getSEO = async (req, res) => {
  try {
    const seoEntry = await SEO.findOne();
    if (!seoEntry) {
      return res.status(404).json({ message: 'No SEO data found' });
    }
    res.status(200).json(seoEntry);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to retrieve SEO data', error: error.message });
  }
};
