// routes/snippetRoutes.js
const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/Code');

// Create Snippet
router.post('/snippets', snippetController.createSnippet);

// Get All Snippets
router.get('/snippets', snippetController.getAllSnippets);

// Get Snippet by ID
router.get('/snippets/:id', snippetController.getSnippetById);

// Update Snippet
router.put('/snippets/:id', snippetController.updateSnippet);

// Delete Snippet
router.delete('/snippets/:id', snippetController.deleteSnippet);

module.exports = router;
