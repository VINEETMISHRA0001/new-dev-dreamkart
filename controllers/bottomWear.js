const BottomWear = require('../models/bottomWear');
const { handleResponse, handleError } = require('../utils/responseHandler');

// Create Bottom Wear
const createBottomWear = async (req, res) => {
  try {
    const product = new BottomWear(req.body);
    const savedProduct = await product.save();
    return handleResponse(
      res,
      201,
      'Bottom Wear created successfully',
      savedProduct
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// Get All Bottom Wear
const getAllBottomWear = async (req, res) => {
  try {
    const products = await BottomWear.find();
    return handleResponse(
      res,
      200,
      'Bottom Wear products fetched successfully',
      products
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// Update Bottom Wear
const updateBottomWear = async (req, res) => {
  try {
    const product = await BottomWear.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return handleResponse(res, 404, 'Bottom Wear not found');
    return handleResponse(
      res,
      200,
      'Bottom Wear updated successfully',
      product
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete Bottom Wear
const deleteBottomWear = async (req, res) => {
  try {
    const product = await BottomWear.findByIdAndDelete(req.params.id);
    if (!product) return handleResponse(res, 404, 'Bottom Wear not found');
    return handleResponse(
      res,
      200,
      'Bottom Wear deleted successfully',
      product
    );
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createBottomWear,
  getAllBottomWear,
  updateBottomWear,
  deleteBottomWear,
};
