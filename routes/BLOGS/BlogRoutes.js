// routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/BLOGS/BlogController');
const {
  authenticateAdmin,
} = require('../../middlewares/Admin/AuthenticateAdmin');

router.post('/articles', articleController.createArticle);
router.get('/articles', articleController.getArticles);
router.get('/articles/:id', articleController.getArticleById);
router.put('/articles/:id', articleController.updateArticle);
router.delete(
  '/articles/:id',

  articleController.deleteArticle
);

module.exports = router;
