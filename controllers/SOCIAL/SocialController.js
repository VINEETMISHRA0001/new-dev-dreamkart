const SocialMedia = require('./../../models/SOCIALMEDIA/SocialMedia');
const cloudinary = require('cloudinary').v2;

const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Create a new social media platform
// exports.createSocialMedia = async (req, res) => {
//   try {
//     const { platform, url, description } = req.body;
//     let icon = '';

//     // Handle the image upload (assumes an image is uploaded via FormData)
//     if (req.file) {
//       const fileName = Date.now() + path.extname(req.file.originalname);
//       const filePath = path.join(__dirname, '../../../uploads', fileName);
//       fs.renameSync(req.file.path, filePath);
//       icon = fileName;
//     }

//     const newSocialMedia = new SocialMedia({
//       platform,
//       url,
//       description,
//       icon,
//     });

//     const savedSocialMedia = await newSocialMedia.save();
//     res.status(201).json(savedSocialMedia);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// Set up multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file uploads in memory
exports.uploadSocialMediaIcon = upload.single('icon');

exports.createSocialMedia = async (req, res) => {
  try {
    const { platform, url, description } = req.body;
    let icon = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
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

      // Ensure Cloudinary upload returns the required URL
      if (result && result.secure_url) {
        icon = result.secure_url; // Store Cloudinary secure URL as icon
      } else {
        return res
          .status(500)
          .json({ error: 'Failed to upload image to Cloudinary' });
      }
    }

    // Create new SocialMedia document
    const newSocialMedia = new SocialMedia({
      platform,
      url,
      description,
      icon,
    });

    const savedSocialMedia = await newSocialMedia.save();
    res.status(201).json(savedSocialMedia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all social media platforms
exports.getAllSocialMedia = async (req, res) => {
  try {
    const socialMediaList = await SocialMedia.find();
    res.status(200).json(socialMediaList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get social media platform by ID
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
    res.status(500).json({ error: error.message });
  }
};

// Update social media platform
exports.updateSocialMedia = async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      const fileName = Date.now() + path.extname(req.file.originalname);
      const filePath = path.join(__dirname, '../uploads', fileName);
      fs.renameSync(req.file.path, filePath);
      updatedData.icon = fileName;
    }

    const updatedSocialMedia = await SocialMedia.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedSocialMedia) {
      return res
        .status(404)
        .json({ message: 'Social media platform not found' });
    }

    res.status(200).json(updatedSocialMedia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete social media platform
exports.deleteSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findByIdAndDelete(req.params.id);
    if (!socialMedia) {
      return res
        .status(404)
        .json({ message: 'Social media platform not found' });
    }

    // Optionally delete the image file from the server if it exists
    if (socialMedia.icon) {
      fs.unlinkSync(path.join(__dirname, '../uploads', socialMedia.icon));
    }

    res
      .status(200)
      .json({ message: 'Social media platform deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
