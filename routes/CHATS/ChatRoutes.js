const express = require("express");
const {
  getChats,
  postMessage,
} = require("../../controllers/CHATS/ChatController");
const authenticateUser = require("../../middlewares/AuthMiddleware");

const router = express.Router();

// Route to get chat history for a specific user
router.get("/history/:userId", getChats);

// Route to handle incoming user messages
router.post("/message", authenticateUser, postMessage);

module.exports = router;
