const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Article = require('../../models/BLOGS/BlogModel');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dqsokzave', // Replace with your Cloudinary cloud name
  api_key: '492147258758824', // Replace with your Cloudinary API key
  api_secret: 'CZSOue2Mi_BiqKXQGzA5lEMF8S4', // Replace with your Cloudinary API secret
});

// Multer Storage Configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images', // Optional: The folder where images will be stored in Cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage: storage });

// Create a new article with image upload
exports.createArticle = [
  // Upload image using Multer and Cloudinary
  upload.single('imageUrl'), // 'imageUrl' should be the name of the form field for image upload
  async (req, res) => {
    try {
      // If the image is uploaded, Cloudinary will return a URL for it
      const imageUrl = req.file ? req.file.path : null;

      // Create the article with Cloudinary image URL
      const article = new Article({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.body.author,
        tags: req.body.tags,
        category: req.body.category,
        imageUrl, // Store the image URL returned by Cloudinary
      });

      // Save the article to the database
      await article.save();
      res.status(201).json(article); // Respond with the created article
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
];

// Get all articles
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an article by ID
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an article by ID
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
