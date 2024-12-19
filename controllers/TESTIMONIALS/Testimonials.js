const Testimonial = require('./../../models/TESTIMONIALS/Testimonials');
const cloudinary = require('./../../config/Cloudinary');

exports.createTestimonial = async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save testimonial with Cloudinary URL
    const testimonial = new Testimonial({
      name: req.body.name,
      message: req.body.message,
      imageUrl: result.secure_url,
    });

    await testimonial.save();
    res.status(201).json({ message: 'Testimonial created!', testimonial });
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial', error });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
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
