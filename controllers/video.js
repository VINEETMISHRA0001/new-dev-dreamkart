const Video = require('../models/video');

// Upload Video
exports.uploadVideo = async (req, res) => {
  try {
    const { title, videoUrl, description, thumbnail } = req.body;

    const newVideo = new Video({
      title,
      videoUrl,
      description,
      //   uploadedBy,
      thumbnail,
    });

    await newVideo.save();
    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: newVideo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message,
    });
  }
};

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message,
    });
  }
};
