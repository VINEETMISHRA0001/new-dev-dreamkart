// /routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadImagesFromZip,
  getAllimages,
} = require('../controllers/ImageController');
const upload = require('../uploads/multer');

const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.get('/', getAllimages);
router.post('/', upload.single('zipFile'), uploadImagesFromZip);

module.exports = router;
