const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Image = require('../models/ImageBulkMode');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }).array('images'); // Handle multiple images

exports.bulkImageUpload = async (req, res) => {
  const uploadDir = path.join(__dirname, '../../uploads');
  try {
    const images = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' });
    }

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Process each uploaded image
    for (const file of req.files) {
      const extname = path.extname(file.originalname).toLowerCase();
      const validExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.tiff',
      ];

      if (!validExtensions.includes(extname)) {
        console.log(`Skipping non-image file: ${file.originalname}`);
        continue;
      }

      const filePath = path.join(uploadDir, file.originalname);

      // Save the file to the filesystem
      fs.writeFileSync(filePath, file.buffer);

      // Save image details to the database
      const newImage = await Image.create({
        name: file.originalname,
        url: filePath, // URL will be the local path for now
        uploadedAt: new Date(),
      });

      images.push(newImage);
      console.log(`Uploaded and saved image: ${newImage.url}`);
    }

    // Handle case where no valid images were processed
    if (images.length === 0) {
      return res
        .status(400)
        .json({ message: 'No valid images found in the upload.' });
    }

    res.status(200).json({ message: 'Images uploaded successfully', images });
  } catch (error) {
    console.error('Error in bulk image upload:', error.message);
    res
      .status(500)
      .json({ message: 'Error uploading images', error: error.message });
  } finally {
    // Clean up uploaded files if necessary (optional)
  }
};
