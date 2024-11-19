const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

// File filter to only allow Excel files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError("Invalid file type. Only Excel files are allowed.", 400),
      false
    );
  }
};

// Multer instance for file uploads
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: { fileSize: 1024 * 1024 * 5 }, // Set a file size limit (e.g., 5MB)
});

module.exports = upload;
