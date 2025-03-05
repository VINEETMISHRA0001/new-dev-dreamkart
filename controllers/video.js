const Video = require('../models/video');

// Extract YouTube video ID from URL
const getYouTubeThumbnail = (url) => {
  const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// Add a new YouTube video
exports.addVideo = async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const thumbnail = getYouTubeThumbnail(url);

    const video = new Video({ title, url, thumbnail });
    await video.save();

    res.status(201).json({ message: 'Video added successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single video by ID
exports.getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ video });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a video by ID
exports.updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, url } = req.body;

    const updatedData = {};
    if (title) updatedData.title = title;
    if (url) {
      updatedData.url = url;
      updatedData.thumbnail = getYouTubeThumbnail(url);
    }

    const video = await Video.findByIdAndUpdate(videoId, updatedData, {
      new: true,
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video updated successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a video by ID
exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
