// controllers/FEEDBACK/ProductFeedbackController.js
const ProductFeedback = require("../../models/FEEDBACK/FeedbackModel");

// Submit Product Feedback
exports.submitFeedback = async (req, res, next) => {
  try {
    const { productId, starRating, comment, images } = req.body;

    // Validate required fields
    if (!productId || !starRating || !comment) {
      return res.status(400).json({
        status: "error",
        message: "Product ID, star rating, and comment are required.",
      });
    }

    const feedback = await ProductFeedback.create({
      productId,
      userId: req.user._id, // Assume user is authenticated and userId is available in req.user
      starRating,
      comment,
      images,
    });

    res.status(201).json({
      status: "success",
      data: {
        feedback,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// ALL FEEDBACKS OF A PRODUCT
exports.getAllFeedback = async (req, res, next) => {
  try {
    const { productId } = req.query; // Optional query parameter to filter by productId

    const filter = productId ? { productId } : {}; // If productId is provided, filter by it

    const feedbacks = await ProductFeedback.find(filter).populate(
      "userId",
      "name email"
    ); // Populate userId for user details

    // Calculate total number of feedbacks
    const totalFeedbacks = feedbacks.length;

    // Initialize counters for each rating (1 to 5 stars)
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    // Sum of all ratings
    let totalRating = 0;

    // Count how many reviews each rating has and calculate the total rating sum
    feedbacks.forEach((feedback) => {
      const rating = feedback.starRating;
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating] += 1;
        totalRating += rating;
      }
    });

    // Calculate percentage distribution for each rating
    const ratingPercentages = Object.keys(ratingCounts).map((rating) => ({
      rating: Number(rating),
      count: ratingCounts[rating],
      percentage:
        totalFeedbacks > 0
          ? ((ratingCounts[rating] / totalFeedbacks) * 100).toFixed(2)
          : "0.00",
    }));

    // Calculate the average rating
    const averageRating =
      totalFeedbacks > 0 ? (totalRating / totalFeedbacks).toFixed(2) : "0.00";

    res.status(200).json({
      status: "success",
      results: totalFeedbacks,
      data: {
        feedbacks,
        ratingAnalysis: {
          totalFeedbacks,
          ratingPercentages,
          averageRating,
        },
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// GET FEEDACK ANALYSIS

exports.calculateReviewPercentage = async (req, res, next) => {
  try {
    const feedbacks = await ProductFeedback.find(); // Get all feedbacks

    const totalReviews = feedbacks.length;
    const starCount = [0, 0, 0, 0, 0]; // Array to hold counts for 1 to 5 stars

    // Count the number of reviews for each star rating
    feedbacks.forEach((feedback) => {
      if (feedback.starRating >= 1 && feedback.starRating <= 5) {
        starCount[feedback.starRating - 1] += 1; // Increment the count for the respective star
      }
    });

    // Calculate percentages
    const reviewPercentages = starCount.map((count) => {
      return totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(2) : 0; // Calculate percentage
    });

    res.status(200).json({
      status: "success",
      data: {
        percentages: {
          1: `${reviewPercentages[0]}%`,
          2: `${reviewPercentages[1]}%`,
          3: `${reviewPercentages[2]}%`,
          4: `${reviewPercentages[3]}%`,
          5: `${reviewPercentages[4]}%`,
        },
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};
