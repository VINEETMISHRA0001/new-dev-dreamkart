require('dotenv').config(); // Load environment variables from .env file

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Article = require('../../models/BLOGS/BlogModel');
const streamifier = require('streamifier');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Environment variable for cloud_name
  api_key: process.env.CLOUDINARY_API_KEY, // Environment variable for api_key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Environment variable for api_secret
});

// Multer Configuration (file stored temporarily in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Helper Function: Upload image to Cloudinary
const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'blog_images', // Store images in 'blog_images' folder on Cloudinary
        transformation: [{ width: 500, height: 500, crop: 'limit' }], // Image resizing
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Create Article
exports.createArticle = [
  upload.single('image'), // Middleware for file upload
  async (req, res) => {
    try {
      let imageUrl = null;

      // Upload the image to Cloudinary if provided
      if (req.file) {
        imageUrl = await uploadImageToCloudinary(req.file.buffer);
      }

      // Parse and structure the input data
      const articleData = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.body.author ? JSON.parse(req.body.author) : {}, // Author object
        tags: req.body.tags ? JSON.parse(req.body.tags) : [], // Tags array
        category: req.body.category,
        subCategory: req.body.subCategory,
        imageUrl, // Cloudinary image URL
      };

      // Create the article
      const article = new Article(articleData);

      // Save the article to the database
      await article.save();

      res.status(201).json(article); // Return the created article
    } catch (err) {
      res.status(400).json({ error: err.message }); // Return error message
    }
  },
];

// Get All Articles
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Article
exports.updateArticle = [
  upload.single('image'), // Middleware for file upload
  async (req, res) => {
    try {
      let imageUrl = null;

      // Upload the image to Cloudinary if provided
      if (req.file) {
        imageUrl = await uploadImageToCloudinary(req.file.buffer);
      }

      // Parse and structure the input data
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.body.author ? JSON.parse(req.body.author) : {}, // Handle author as an object
        tags: req.body.tags ? JSON.parse(req.body.tags) : [], // Tags as an array
        category: req.body.category,
        subCategory: req.body.subCategory,
        imageUrl: imageUrl || undefined, // Only update imageUrl if new image is provided
      };

      // Update the article in the database
      const article = await Article.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true, // Ensure schema validation
        }
      );

      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      // Return the updated article
      res.json(article);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
];

// Delete Article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
