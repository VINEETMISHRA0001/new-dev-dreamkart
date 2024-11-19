const express = require("express");
const router = express.Router();
const multer = require("multer");
const imageController = require("../controllers/ImageBulkController");
const ImageBulkMode = require("../models/ImageBulkMode");
const upload = multer({ dest: "uploads/" }); // Temporary storage

// Endpoint to upload zip file
router.post(
  "/bulk-upload",
  upload.single("zipfile"),
  imageController.bulkImageUpload
);

module.exports = router;

// Get all images
router.get("/", async (req, res) => {
  try {
    const images = await ImageBulkMode.find(); // Fetch all images from the database
    res.status(200).json(images); // Respond with the images
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
