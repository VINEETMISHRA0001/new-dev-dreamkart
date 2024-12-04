const multer = require('multer');

// Use memory storage for temporary handling
const storage = multer.memoryStorage();

// Multer instance for ZIP files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.zip']; // Only allow ZIP files
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (allowedExtensions.includes(`.${ext}`)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only ZIP files are allowed!'), false); // Reject non-ZIP files
    }
  },
});

module.exports = upload;
