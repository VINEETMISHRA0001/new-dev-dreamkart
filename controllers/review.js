const Review = require('../models/review');

// Create a review
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Extract userId from the authenticated token
    const userId = req.user.id; // Ensure `req.user` is set in the auth middleware

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const review = new Review({ productId, userId, rating, comment });
    await review.save();

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get reviews by product
const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const reviews = await Review.find({ productId })
      .populate('userId', 'name email') // Populating user details
      .sort({ createdAt: -1 }); // Sorting by latest reviews first

    res.status(200).json({ message: 'Reviews fetched successfully', reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body; // User must send their ID

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res
        .status(404)
        .json({ message: 'Review not found or unauthorized' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { createReview, getReviews, deleteReview };
