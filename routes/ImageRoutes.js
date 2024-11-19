// /routes/imageRoutes.js
const express = require("express");
const multer = require("multer");
const { uploadImagesFromZip } = require("../controllers/ImageController");
const upload = require("../uploads/multer");

const router = express.Router();
const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.post("/upload", upload.single("zipFile"), uploadImagesFromZip);

module.exports = router;
