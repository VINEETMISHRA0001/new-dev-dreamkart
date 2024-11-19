const Subcategory = require('../../models/CATEGORIES/SubcategoriesSchema');

exports.createSubcategory = async (req, res) => {
  try {
    const { name, parentCategory, description } = req.body;
    const subcategory = new Subcategory({ name, parentCategory, description });
    await subcategory.save();
    res.status(201).json({ success: true, subcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Subcategories
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('parentCategory');
    res.status(200).json({ success: true, subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, updatedSubcategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Subcategory.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
