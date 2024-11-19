const Banner = require("./../../models/BANNERS/BannerModel");
const CatchAsync = require("./../../utils/CatchAsyncErrorjs");
const AppError = require("./../../utils/AppError"); // Corrected typo

exports.createBanner = CatchAsync(async (req, res, next) => {
  try {
    let imagePath = null;

    // Check if the file is uploaded
    if (req.file) {
      imagePath = req.file.path; // Save the file path
    }

    if (!imagePath) {
      return next(new AppError("Image is required", 400)); // Handle missing image
    }

    // Create a new banner with the image path
    const newBanner = new Banner({
      image: imagePath,
    });

    // Save the banner to the database
    await newBanner.save();

    // Send success response with banner details
    res.status(201).json({
      status: "success",
      message: "Successfully created a banner",
      data: {
        banner: newBanner,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// get all banners

exports.getAllBanner = CatchAsync(async (req, res, next) => {
  try {
    const banners = await Banner.find();

    res.status(200).json({ status: true, banners });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
