const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const cloudinary = require('cloudinary').v2;
const Image = require('../models/ImageBulkMode');

exports.bulkImageUpload = async (req, res) => {
  const extractDir = path.join(__dirname, '../../uploads');

  try {
    const images = [];

    // Validate if a ZIP file was uploaded
    if (
      !req.file ||
      path.extname(req.file.originalname).toLowerCase() !== '.zip'
    ) {
      return res
        .status(400)
        .json({ message: 'Please upload a valid .zip file.' });
    }

    // Ensure the directory for extracted files exists
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir);
    }

    // Extract ZIP file contents
    const zip = new AdmZip(req.file.path);
    zip.extractAllTo(extractDir, true);

    // Process extracted files
    const extractedFiles = fs
      .readdirSync(extractDir)
      .map((file) => path.join(extractDir, file));

    for (const file of extractedFiles) {
      const extname = path.extname(file).toLowerCase();
      const validExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.tiff',
      ];

      if (!validExtensions.includes(extname)) {
        console.log(`Skipping non-image file: ${file}`);
        continue;
      }

      try {
        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file, {
          folder: 'catalog-images', // Customize the Cloudinary folder
        });

        // Save image details to the database
        const newImage = await Image.create({
          name: uploadResult.public_id,
          url: uploadResult.secure_url,
          uploadedAt: new Date(),
        });

        images.push(newImage);

        // Remove the local file after successful upload
        fs.unlinkSync(file);
        console.log(`Uploaded and saved image: ${newImage.url}`);
      } catch (err) {
        console.error(`Error uploading file (${file}):`, err.message);
      }
    }

    // Clean up the uploaded ZIP file
    fs.unlinkSync(req.file.path);

    // Handle case where no images were processed
    if (images.length === 0) {
      return res
        .status(400)
        .json({ message: 'No valid images found in the ZIP file.' });
    }

    res.status(200).json({ message: 'Images uploaded successfully', images });
  } catch (error) {
    console.error('Error in bulk image upload:', error.message);
    res
      .status(500)
      .json({ message: 'Error uploading images', error: error.message });
  } finally {
    // Ensure cleanup of leftover files in the extract directory
    if (fs.existsSync(extractDir)) {
      fs.readdirSync(extractDir).forEach((file) =>
        fs.unlinkSync(path.join(extractDir, file))
      );
    }
  }
};
