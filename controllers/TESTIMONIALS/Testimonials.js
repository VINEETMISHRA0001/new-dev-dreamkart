const Testimonial = require('./../../models/TESTIMONIALS/Testimonials');
const cloudinary = require('./../../config/Cloudinary');
const multer = require('multer');

/////////////

// Set up multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file uploads in memory
exports.uploadTestimonialImage = upload.single('image');

exports.createTestimonial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

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

    if (!result || !result.secure_url) {
      return res
        .status(500)
        .json({ message: 'Failed to upload image to Cloudinary' });
    }

    const testimonial = new Testimonial({
      name: req.body.name,
      message: req.body.message,
      imageUrl: result.secure_url,
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

    // Find the testimonial by ID
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Extract the public ID from the Cloudinary URL
    const imageUrlParts = testimonial.imageUrl.split('/');
    const publicIdWithExtension = imageUrlParts[imageUrlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];

    // Remove the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete the testimonial from the database
    await Testimonial.findByIdAndDelete(id);

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error });
  }
};

exports.toggleTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the testimonial by ID
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Toggle the isActive field
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
