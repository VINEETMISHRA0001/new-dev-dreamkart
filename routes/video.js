const express = require('express');
const { uploadVideo, getVideos } = require('../controllers/video.js');

const router = express.Router();

router.post('/upload', uploadVideo); // Upload video
router.get('/videos', getVideos); // Fetch all videos

module.exports = router;
