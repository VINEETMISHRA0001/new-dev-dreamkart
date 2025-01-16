const Testimonial = require('./../../models/TESTIMONIALS/Testimonials');
const multer = require('multer');
const path = require('path');

// Set up multer storage to save images locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    ); // Use original file extension
  },
});

const upload = multer({ storage });

// Middleware to handle file uploads locally
exports.uploadTestimonialImage = upload.single('image');

exports.createTestimonial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Build the file path of the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;

    const testimonial = new Testimonial({
      name: req.body.name,
      message: req.body.message,
      imageUrl: imageUrl, // Save the local image URL
      isActive: req.body.isActive || true, // Set isActive (optional)
    });

    await testimonial.save();
    res.status(201).json({ message: 'Testimonial created!', testimonial });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating testimonial', error: error.message });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const { isActive } = req.query;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true'; // Convert string to Boolean
    }

    const testimonials = await Testimonial.find(query);
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Delete the image from the server (optional, if you want to remove it when deleting the testimonial)
    const imagePath = `uploads/${testimonial.imageUrl.split('/')[2]}`;
    const fs = require('fs');
    fs.unlinkSync(imagePath); // Delete the file from the local file system

    await Testimonial.findByIdAndDelete(id);

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error });
  }
};

exports.toggleTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.status(200).json({
      message: `Testimonial ${
        testimonial.isActive ? 'activated' : 'deactivated'
      } successfully`,
      testimonial,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error toggling testimonial status', error });
  }
};
