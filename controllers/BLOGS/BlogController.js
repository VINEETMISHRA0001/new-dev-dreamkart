const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Article = require('../../models/BLOGS/BlogModel');
const streamifier = require('streamifier');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dkmessaij', // Replace with your Cloudinary cloud name
  api_key: '135528738176537', // Replace with your Cloudinary API key
  api_secret: 'OpL1iTkxJx8ySP0xPDe2edzQaSw', // Replace with your Cloudinary API secret
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
        folder: 'blog_images',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

exports.createArticle = [
  upload.single('image'), // 'image' should be the name of the form field for image upload
  async (req, res) => {
    try {
      let imageUrl = null;

      // Upload the file to Cloudinary if provided
      if (req.file) {
        imageUrl = await uploadImageToCloudinary(req.file.buffer);
      }

      // Parse and structure the input data
      const articleData = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.body.author ? JSON.parse(req.body.author) : {}, // Author as an object (optional fields)
        tags: req.body.tags ? JSON.parse(req.body.tags) : [], // Tags as an array (optional)
        category: req.body.category,
        subCategory: req.body.subCategory,
        imageUrl, // Cloudinary image URL
      };

      // Create the article with the structured data
      const article = new Article(articleData);

      // Save the article to the database
      await article.save();

      res.status(201).json(article); // Respond with the created article
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
];

// Other CRUD operations remain unchanged...

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

exports.updateArticle = [
  upload.single('image'), // 'image' should be the name of the form field for image upload
  async (req, res) => {
    try {
      let imageUrl = null;

      // Upload the file to Cloudinary if provided
      if (req.file) {
        imageUrl = await uploadImageToCloudinary(req.file.buffer);
      }

      // Parse and structure the input data
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.body.author ? JSON.parse(req.body.author) : {}, // Handle author as an object (optional)
        tags: req.body.tags ? JSON.parse(req.body.tags) : [], // Tags as an array (optional)
        category: req.body.category,
        subCategory: req.body.subCategory,
        imageUrl: imageUrl || undefined, // Only update imageUrl if new image is provided
      };

      // Check if author fields are missing when updating
      if (
        updateData.author &&
        (!updateData.author.name || !updateData.author.email)
      ) {
        return res.status(400).json({
          message: 'Both author name and email are required.',
        });
      }

      // Update the article in the database
      const article = await Article.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true, // Ensure schema validation is applied
        }
      );

      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      // Return the updated article
      res.json(article);
    } catch (err) {
      // Handle any errors that may occur
      res.status(400).json({ error: err.message });
    }
  },
];

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
