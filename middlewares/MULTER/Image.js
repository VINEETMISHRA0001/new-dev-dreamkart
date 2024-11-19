const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add your Cloudinary Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY, // Add your Cloudinary API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Add your Cloudinary API Secret
});

// Set up Cloudinary storage with multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "categories", // Cloudinary folder where images will be stored
    allowed_formats: ["jpeg", "jpg", "png", "gif"], // Allowed file formats
    public_id: (req, file) => {
      return file.fieldname + "-" + Date.now(); // Public ID for the uploaded image
    },
  },
});

// Initialize multer with the Cloudinary storage and file size limit
const upload = multer({
  storage: storage,
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
      cb(new Error("Only image files are allowed!"));
    }
  },
});

module.exports = upload;
