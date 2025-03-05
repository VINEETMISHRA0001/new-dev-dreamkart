const express = require('express');
const {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require('../controllers/video');

const router = express.Router();

router.post('/add', addVideo); // Add YouTube video
router.get('/all', getVideos); // Fetch all videos
router.get('/:videoId', getVideoById); // Fetch single video
router.put('/:videoId', updateVideo); // Update video
router.delete('/:videoId', deleteVideo); // Delete video

module.exports = router;
