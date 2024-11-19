const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const cloudinary = require("cloudinary").v2;
const Image = require("../models/ImageBulkMode"); // Assuming you have an Image model

// exports.bulkImageUpload = async (req, res) => {
//   try {
//     const images = [];

//     // Validate if req.file exists and is a .zip file
//     if (!req.file || path.extname(req.file.originalname) !== ".zip") {
//       return res.status(400).json({ message: "Please upload a .zip file." });
//     }

//     // Define directory for extracted files
//     const extractDir = path.join(__dirname, "../../uploads");
//     if (!fs.existsSync(extractDir)) {
//       fs.mkdirSync(extractDir);
//     }

//     // Extract the ZIP file to the extractDir
//     const zip = new AdmZip(req.file.path);
//     zip.extractAllTo(extractDir, true);

//     // Get all extracted file paths
//     const extractedFiles = fs
//       .readdirSync(extractDir)
//       .map((file) => path.join(extractDir, file));

//     if (extractedFiles.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No valid images found in the ZIP file." });
//     }

//     // Process each image file
//     for (const file of extractedFiles) {
//       if (!/\.(jpg|jpeg|png|gif)$/i.test(path.extname(file))) {
//         console.log("Skipping non-image file:", file);
//         continue;
//       }

//       try {
//         console.log("Uploading file to Cloudinary:", file);

//         // Upload image to Cloudinary
//         const uploadResult = await cloudinary.uploader.upload(file, {
//           folder: "catalog-images",
//         });

//         // Save to database
//         const newImage = await Image.create({
//           name: uploadResult.public_id,
//           url: uploadResult.secure_url,
//           uploadedAt: new Date(),
//         });

//         images.push(newImage);

//         // Remove the uploaded local file
//         fs.unlinkSync(file);
//       } catch (err) {
//         console.error("Error uploading file:", file, err);
//       }
//     }

//     // Remove the ZIP file after processing
//     fs.unlinkSync(req.file.path);

//     // If no images were processed, return an error message
//     if (images.length === 0) {
//       return res.status(500).json({
//         message: "No images uploaded. Please check the ZIP file content.",
//       });
//     }

//     res.status(200).json({
//       message: "Images uploaded successfully",
//       images,
//     });
//   } catch (error) {
//     console.error("Error in bulk image upload:", error);
//     res.status(500).json({ message: "Error uploading images", error });
//   } finally {
//     // Cleanup any remaining files in extractDir if necessary
//     fs.readdir(extractDir, (err, files) => {
//       if (err) return console.error("Error reading extract directory:", err);
//       files.forEach((file) => fs.unlinkSync(path.join(extractDir, file)));
//     });
//   }
// };

exports.bulkImageUpload = async (req, res) => {
  try {
    const images = [];

    // Ensure req.file exists and is a ZIP file
    if (!req.file || path.extname(req.file.originalname) !== ".zip") {
      return res.status(400).json({ message: "Please upload a .zip file." });
    }

    // Define a directory for extracted files
    const extractDir = path.join(__dirname, "../../uploads");

    // Extract the ZIP file
    const zip = new AdmZip(req.file.path);
    zip.extractAllTo(extractDir, true);

    // Get all extracted file paths
    const extractedFiles = fs
      .readdirSync(extractDir)
      .map((file) => path.join(extractDir, file));

    // Process each extracted image file
    for (const file of extractedFiles) {
      try {
        // Check if the file is an image
        const extname = path.extname(file).toLowerCase();
        const validImageExtensions = [
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".bmp",
          ".tiff",
        ];
        if (!validImageExtensions.includes(extname)) {
          console.log(`Skipping non-image file: ${file}`);
          continue; // Skip non-image files
        }

        // Upload each image to Cloudinary
        console.log(`Uploading file to Cloudinary: ${file}`);
        const uploadResult = await cloudinary.uploader.upload(file, {
          folder: "catalog-images", // Customize folder name in Cloudinary
        });

        // Save upload details to the database
        const newImage = await Image.create({
          name: uploadResult.public_id,
          url: uploadResult.secure_url,
          uploadedAt: new Date(),
        });

        images.push(newImage);
        console.log(`Uploaded and saved image: ${newImage.url}`);

        // Delete the temporary image file after upload
        fs.unlinkSync(file);
      } catch (err) {
        console.error("Error processing file:", file, err);
      }
    }

    // Clean up the ZIP file after processing
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Images uploaded successfully",
      images,
    });
  } catch (error) {
    console.error("Error in bulk image upload:", error);
    res
      .status(500)
      .json({ message: "Error uploading images", error: error.message });
  }
};
