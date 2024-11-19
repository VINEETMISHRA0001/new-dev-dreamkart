// index.js
const express = require("express");
const {
  submitFeedback,
  getAllFeedback,
  calculateReviewPercentage,
} = require("../../controllers/FEEDBACK/FeedbackController");
const authenticateUser = require("../../middlewares/AuthMiddleware");
// Other imports...

const router = express.Router();

// Other middleware...

// Routes
router.post("/create", authenticateUser, submitFeedback);
router.get("/all", getAllFeedback);
router.get("/review-percentage", calculateReviewPercentage);

module.exports = router;
