const User = require('../models/UserSchema');
const CatchAsyncErrorjs = require('../utils/CatchAsyncErrorjs');
const UserProfile = require('./../models/ProfileSchema'); // Ensure the path is correct
const AppError = require('./../utils/AppError'); // Custom AppError for handling application errors

// Create user profile details
// Create user profile details
exports.createProfile = CatchAsyncErrorjs(async (req, res, next) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    alternateMobileNumber,
    dateOfBirth,
    country,
    // Expecting coordinates [longitude, latitude] from the client
  } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !mobileNumber || !dateOfBirth || !country) {
    return next(new AppError('All required fields must be provided.', 400));
  }

  // Validate if the user is authenticated and verified
  if (!req.user || !req.user.isVerified) {
    return next(new AppError('User is not verified or authenticated.', 403));
  }

  // Check if a profile already exists for the user
  const existingProfile = await UserProfile.findOne({ userId: req.user.id });
  if (existingProfile) {
    return next(new AppError('Profile already exists.', 400));
  }

  // Create the new profile
  const userProfile = new UserProfile({
    userId: req.user.id, // The authenticated user's ID
    firstName,
    lastName,
    mobileNumber,
    alternateMobileNumber, // Optional field
    dateOfBirth,
    country,
  });

  // Save the profile to the database
  await userProfile.save();

  res.status(201).json({
    status: 'success',
    message: 'Profile created successfully.',
    profile: userProfile,
  });
});

// Update Profile Details
exports.updateProfile = CatchAsyncErrorjs(async (req, res, next) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    alternateMobileNumber,
    dateOfBirth,
    country,
    location,
  } = req.body;

  // Validate if the user is authenticated and verified
  if (!req.user || !req.user.isVerified) {
    return next(new AppError('User is not verified or authenticated.', 403));
  }

  // Find the user profile
  const userProfile = await UserProfile.findOne({ userId: req.user.id });
  if (!userProfile) {
    return next(new AppError('Profile not found.', 404));
  }

  // Update the profile fields only if they are provided
  userProfile.firstName = firstName || userProfile.firstName;
  userProfile.lastName = lastName || userProfile.lastName;
  userProfile.mobileNumber = mobileNumber || userProfile.mobileNumber;
  userProfile.alternateMobileNumber =
    alternateMobileNumber || userProfile.alternateMobileNumber;
  userProfile.dateOfBirth = dateOfBirth || userProfile.dateOfBirth;
  userProfile.country = country || userProfile.country;
  userProfile.location = location || userProfile.location;

  // Save the updated profile
  await userProfile.save();

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully.',
    profile: userProfile,
  });
});

// GET PROFILE DETAILS
// Get Profile Details for Authenticated User
exports.getProfileDetails = CatchAsyncErrorjs(async (req, res, next) => {
  // Validate if the user is authenticated
  if (!req.user) {
    return next(new AppError('User is not authenticated.', 401));
  }

  // Fetch the user's profile based on their ID
  const userProfile = await UserProfile.findOne({ userId: req.user.id });

  if (!userProfile) {
    return next(new AppError('Profile not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Profile retrieved successfully.',
    profile: userProfile,
  });
});

// Add a product to recently viewed

exports.addToRecentlyViewed = CatchAsyncErrorjs(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; // Assuming user is authenticated

  try {
    const user = await User.findById(userId);

    // Check if the product is already in the recently viewed list
    if (!user.recentlyViewed.includes(productId)) {
      user.recentlyViewed.push(productId);
      await user.save();
    }

    res.status(200).json({
      message: 'Product added to recently viewed',
      recentlyViewed: user.recentlyViewed,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating recently viewed products', error });
  }
});
