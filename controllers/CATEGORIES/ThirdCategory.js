const ThirdCategory = require('../../models/CATEGORIES/ThirdCategory');

// CREATE a new third category
exports.createThirdCategory = async (req, res) => {
  try {
    const { name, parentSubcategory, description } = req.body;
    const thirdCategory = new ThirdCategory({
      name,
      parentSubcategory,
      description,
    });
    const savedCategory = await thirdCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ all third categories
exports.getAllThirdCategories = async (req, res) => {
  try {
    const thirdCategories = await ThirdCategory.find().populate(
      'parentSubcategory'
    );
    res.status(200).json(thirdCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ a specific third category by ID
exports.getThirdCategoryById = async (req, res) => {
  try {
    const thirdCategory = await ThirdCategory.findById(req.params.id).populate(
      'parentSubcategory'
    );
    if (!thirdCategory) {
      return res.status(404).json({ error: 'Third category not found' });
    }
    res.status(200).json(thirdCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a third category by ID
exports.updateThirdCategory = async (req, res) => {
  try {
    const { name, parentSubcategory, description } = req.body;
    const updatedCategory = await ThirdCategory.findByIdAndUpdate(
      req.params.id,
      { name, parentSubcategory, description },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Third category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a third category by ID
exports.deleteThirdCategory = async (req, res) => {
  try {
    const deletedCategory = await ThirdCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Third category not found' });
    }
    res.status(200).json({ message: 'Third category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
