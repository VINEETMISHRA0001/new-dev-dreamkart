const AdmZip = require('adm-zip');
const Image = require('../models/ImageModel');
const cloudinary = require('../config/Cloudinary');

exports.uploadImagesFromZip = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No ZIP file uploaded' });
    }

    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();
    const uploadedImages = [];

    for (const entry of zipEntries) {
      if (!entry.isDirectory) {
        const fileName = entry.entryName;

        // Check if the file has a valid image extension
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const isValidImage = validExtensions.some((ext) =>
          fileName.toLowerCase().endsWith(ext)
        );

        if (!isValidImage) {
          console.warn(`Skipped non-image file: ${fileName}`);
          continue;
        }

        // Upload to Cloudinary
        const imageBuffer = entry.getData();
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'uploaded_images',
              public_id: fileName.replace(/\.[^/.]+$/, ''),
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(imageBuffer);
        });

        // Save image info to database
        const newImage = new Image({
          filename: uploadResult.public_id,
          path: uploadResult.secure_url,
        });

        await newImage.save();
        uploadedImages.push(newImage);
      }
    }

    res.status(200).json({
      message: 'Images uploaded successfully',
      images: uploadedImages,
    });
  } catch (error) {
    console.error('Error uploading images from ZIP:', error);
    res
      .status(500)
      .json({ message: 'Error uploading images', error: error.message });
  }
};

exports.getAllimages = async (req, res) => {
  try {
    const images = await Image.find(); // Fetch all images from the database
    res.status(200).json({
      message: 'Images fetched successfully',
      images,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      message: 'Failed to fetch images',
      error: error.message,
    });
  }
};
