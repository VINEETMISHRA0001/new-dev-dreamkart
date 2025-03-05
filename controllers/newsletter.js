const Newsletter = require('../models/newsletter');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user._id; // Extracted from authMiddleware
    console.log('resssssssqqqqq', req);
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the email is already subscribed
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Save subscription
    const subscription = new Newsletter({ userId, email });
    await subscription.save();

    res.status(201).json({ message: 'Subscribed successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.status(200).json({ subscribers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { newsletterId } = req.params; // Get ID from URL params

    // Find and delete subscription by ID
    const subscription = await Newsletter.findByIdAndDelete(newsletterId);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
