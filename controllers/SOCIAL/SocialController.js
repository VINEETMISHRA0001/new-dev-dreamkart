const SocialMedia = require('./../../models/SOCIALMEDIA/SocialMedia');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      './../../uploads/social_media_icons'
    );
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Initialize Multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
  },
});

// Middleware to handle file upload
exports.uploadSocialMediaIcon = upload.single('icon');

// Create Social Media Platform
exports.createSocialMedia = async (req, res) => {
  try {
    const { platform, url, description } = req.body;
    let icon = '';

    // Save the uploaded file path if provided
    if (req.file) {
      icon = `/uploads/social_media_icons/${req.file.filename}`; // Save the relative path
    }

    // Create a new SocialMedia document
    const newSocialMedia = new SocialMedia({
      platform,
      url,
      description,
      icon,
    });

    const savedSocialMedia = await newSocialMedia.save();
    res.status(201).json(savedSocialMedia);
  } catch (error) {
    console.error('Error creating social media:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all Social Media Platforms
exports.getAllSocialMedia = async (req, res) => {
  try {
    const socialMediaList = await SocialMedia.find();
    res.status(200).json(socialMediaList);
  } catch (error) {
    console.error('Error fetching social media platforms:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get Social Media Platform by ID
exports.getSocialMediaById = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findById(req.params.id);
    if (!socialMedia) {
      return res
        .status(404)
        .json({ message: 'Social media platform not found' });
    }
    res.status(200).json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media platform:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update Social Media Platform
exports.updateSocialMedia = async (req, res) => {
  try {
    const { platform, url, description } = req.body;
    const updatedData = {
      platform,
      url,
      description,
    };

    // Handle uploaded file (if any)
    if (req.file) {
      updatedData.icon = `/uploads/social_media_icons/${req.file.filename}`;
    }

    const updatedSocialMedia = await SocialMedia.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedSocialMedia) {
      return res
        .status(404)
        .json({ message: 'Social media platform not found' });
    }

    res.status(200).json(updatedSocialMedia);
  } catch (error) {
    console.error('Error updating social media platform:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete Social Media Platform
exports.deleteSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findByIdAndDelete(req.params.id);
    if (!socialMedia) {
      return res
        .status(404)
        .json({ message: 'Social media platform not found' });
    }

    // Delete the associated icon file if it exists
    if (socialMedia.icon) {
      const filePath = path.join(__dirname, './../../', socialMedia.icon);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res
      .status(200)
      .json({ message: 'Social media platform deleted successfully' });
  } catch (error) {
    console.error('Error deleting social media platform:', error.message);
    res.status(500).json({ error: error.message });
  }
};
