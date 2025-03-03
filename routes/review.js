const express = require('express');
const {
  createReview,
  getReviews,
  deleteReview,
} = require('../controllers/review');
const authenticateUser = require('../middlewares/AuthMiddleware');

const router = express.Router();

router.post('/', authenticateUser, createReview);
router.get('/:productId', getReviews);
router.delete('/:reviewId', deleteReview);

module.exports = router;
