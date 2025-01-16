const multer = require('multer');
const Article = require('../../models/BLOGS/BlogModel');

// Multer Configuration
const memoryStorage = multer.memoryStorage(); // Store files temporarily in memory
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
  }
};

const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Helper Function: Save file to uploads directory
const saveFileToUploads = (file) => {
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, '../../uploads/blog_images');

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const uniqueFilename = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(uploadsDir, uniqueFilename);

  // Write file buffer to disk
  fs.writeFileSync(filePath, file.buffer);

  // Return relative file path
  return `uploads/blog_images/${uniqueFilename}`;
};

// Create Article
exports.createArticle = [
  upload.single('image'), // Middleware for file upload
  async (req, res) => {
    try {
      let imageUrl = null;

      // Save the image to the uploads directory if provided
      if (req.file) {
        imageUrl = saveFileToUploads(req.file);
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
        imageUrl, // Local file path
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

      // Save the image to the uploads directory if provided
      if (req.file) {
        imageUrl = saveFileToUploads(req.file);
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
        imageUrl: imageUrl || undefined, // Only update imageUrl if a new image is provided
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
