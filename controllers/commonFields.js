// controllers/commonFieldsController.js
const CommonFields = require('../models/commonFields');

exports.createCommonFields = async (req, res) => {
  try {
    const newCommonFields = new CommonFields(req.body);
    await newCommonFields.save();
    res.status(201).json({ success: true, data: newCommonFields });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// More CRUD functions can be added as needed (e.g., get, update, delete)
