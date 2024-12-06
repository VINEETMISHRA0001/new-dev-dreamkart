const multer = require('multer');
const memoryStorage = multer.memoryStorage(); // Use memory storage for file uploads in platforms like Vercel

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
  }
};

// Initialize multer with memory storage and file filter
const upload = multer({ storage: memoryStorage, fileFilter });

// Export the configured middleware
module.exports = upload;
