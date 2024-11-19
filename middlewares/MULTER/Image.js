const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add your Cloudinary Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY, // Add your Cloudinary API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Add your Cloudinary API Secret
});

// Multer configuration: In-memory storage and file type validation
const multerConfig = multer({
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

// Cloudinary upload logic
const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder, // Specify folder in Cloudinary
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

// Combined Export: Middleware for multer and helper for Cloudinary
const upload = multerConfig.single('image'); // 'image' is the field name in the form

upload.cloudinaryUpload = async (fileBuffer, folder = 'default') => {
  return uploadToCloudinary(fileBuffer, folder);
};

module.exports = upload;
