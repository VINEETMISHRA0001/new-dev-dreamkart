const Chat = require("../../models/CHATS/ChatModel");

// Fetch chat history for a specific user
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving chat history" });
  }
};

const postMessage = async (req, res) => {
  const { message } = req.body;

  // Check if required fields are missing
  if (!message) {
    return res
      .status(400)
      .json({ message: "Missing required fields: userId or message" });
  }

  try {
    // Create a new chat message
    const newMessage = await Chat.create({
      userId: req.user._id,
      message,
      sender: "user", // Default to 'user' for incoming messages
    });

    res.status(201).json(newMessage);

    // Optionally, you can add NLP or bot response logic here
  } catch (error) {
    console.error("Error in postMessage:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};
module.exports = { getChats, postMessage };
