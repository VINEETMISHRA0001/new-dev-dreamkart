// /controllers/ImageController.js
const AdmZip = require("adm-zip");
const Image = require("../models/ImageModel");
const cloudinary = require("../config/Cloudinary");

exports.uploadImagesFromZip = async (req, res) => {
  try {
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();
    const uploadedImages = [];

    for (const entry of zipEntries) {
      if (!entry.isDirectory) {
        const imageBuffer = entry.getData();
        const fileName = entry.entryName;

        // Check if the file is an image (basic extension check)
        const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        if (!validExtensions.some((ext) => fileName.endsWith(ext))) {
          console.warn(`Skipped non-image file: ${fileName}`);
          continue;
        }

        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              public_id: fileName.replace(/\.[^/.]+$/, ""), // Remove extension for public_id
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
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
      message: "Images uploaded and saved successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error uploading images", error: error.message });
  }
};
