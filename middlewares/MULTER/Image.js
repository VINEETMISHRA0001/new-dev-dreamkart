const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dqsokzave',
  api_key: '492147258758824',
  api_secret: 'CZSOue2Mi_BiqKXQGzA5lEMF8S4',
});

// Initialize multer with in-memory storage and file size limit
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory temporarily
  limits: { fileSize: 1000000 }, // 1 MB limit
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Function to handle the Cloudinary upload
const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder, // The folder in Cloudinary to store the image
          transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional transformations
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url); // Return the secure URL of the uploaded image
          }
        }
      )
      .end(fileBuffer);
  });
};

module.exports = { upload, uploadToCloudinary };
