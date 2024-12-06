const multer = require('multer');
const path = require('path');

// Set up multer memory storage (for Cloud environments like Vercel)
const storage = multer.memoryStorage(); // Store files in memory instead of on disk

// File filter to allow only Excel files
const fileFilter = (req, file, cb) => {
  const fileTypes = ['.xls', '.xlsx'];
  const extname = path.extname(file.originalname).toLowerCase();
  if (fileTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed!'), false);
  }
};

// Multer configuration
const uploadExcel = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = uploadExcel;
