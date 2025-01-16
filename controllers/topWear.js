const TopWear = require('../models/Topwear');
const { handleResponse, handleError } = require('../utils/responseHandler');

// Create Top Wear
const createTopWear = async (req, res) => {
  try {
    const product = new TopWear(req.body);
    const savedProduct = await product.save();
    return handleResponse(
      res,
      201,
      'Top Wear created successfully',
      savedProduct
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// Get All Top Wear
const getAllTopWear = async (req, res) => {
  try {
    const products = await TopWear.find();
    return handleResponse(
      res,
      200,
      'Top Wear products fetched successfully',
      products
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// Update Top Wear
const updateTopWear = async (req, res) => {
  try {
    const product = await TopWear.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return handleResponse(res, 404, 'Top Wear not found');
    return handleResponse(res, 200, 'Top Wear updated successfully', product);
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete Top Wear
const deleteTopWear = async (req, res) => {
  try {
    const product = await TopWear.findByIdAndDelete(req.params.id);
    if (!product) return handleResponse(res, 404, 'Top Wear not found');
    return handleResponse(res, 200, 'Top Wear deleted successfully', product);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { createTopWear, getAllTopWear, updateTopWear, deleteTopWear };
