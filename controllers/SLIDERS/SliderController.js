const Slider = require('./../../models/SLIDERS/SliderModel');
const cloudinary = require('./../../config/Cloudinary');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file uploads in memory
exports.uploadSliderImage = upload.single('image');

// Create a new slider
exports.createSlider = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: 'No file uploaded' });
    }

    // Upload image to Cloudinary from buffer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, uploadedResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadedResult);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    // Ensure Cloudinary upload returns the required fields
    if (!result || !result.public_id || !result.secure_url) {
      return res.status(500).json({
        success: false,
        error: 'Failed to upload image to Cloudinary',
      });
    }

    // Create a new slider with imageUrl and cloudinaryId
    const slider = new Slider({
      title: req.body.title,
      description: req.body.description,
      cloudinaryId: result.public_id, // Store Cloudinary public ID
      imageUrl: result.secure_url, // Store Cloudinary secure URL
    });

    await slider.save();
    res.status(201).json({ success: true, data: slider });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// Get all sliders
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.status(200).json({ success: true, data: sliders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a slider
exports.updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res
        .status(404)
        .json({ success: false, error: 'Slider not found' });
    }

    // Handle image update if a new file is uploaded
    if (req.file) {
      // Destroy the old image if a new one is uploaded
      await cloudinary.uploader.destroy(slider.cloudinaryId);
      const result = await cloudinary.uploader.upload(req.file.path); // Upload the new image
      slider.cloudinaryId = result.public_id; // Update the Cloudinary public ID
      slider.imageUrl = result.secure_url; // Update the image URL
    }

    // Update other fields
    slider.title = req.body.title || slider.title;
    slider.description = req.body.description || slider.description;
    slider.isActive =
      req.body.isActive !== undefined ? req.body.isActive : slider.isActive;

    await slider.save();
    res.status(200).json({ success: true, data: slider });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a slider
exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res
        .status(404)
        .json({ success: false, error: 'Slider not found' });
    }

    await cloudinary.uploader.destroy(slider.cloudinaryId); // Delete the image from Cloudinary
    await slider.remove();

    res
      .status(200)
      .json({ success: true, message: 'Slider deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
