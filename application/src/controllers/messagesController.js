const { getPool } = require("../config/db");

const sendMessage = async (req, res) => {
  console.log("sendMessage called with body:", req.body);
  const { recipientId, message } = req.body;
  const senderId = req.session.user.id;

  if (!senderId) {
    console.error("No user in session");
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!recipientId || !message) {
    console.error("Missing recipientId or message");
    return res.status(400).json({ message: "Missing recipientId or message" });
  }

  try {
    const pool = await getPool();
    await pool.query(
      "INSERT INTO messages (sender_id, recipient_id, message) VALUES (?, ?, ?)",
      [senderId, recipientId, message]
    );
    console.log("Message sent successfully");
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

const getMessages = async (req, res) => {
  console.log("getMessages controller called");
  const userId = req.session.user.id;

  try {
    const pool = await getPool();
    const [messages] = await pool.query(
      `SELECT m.*, 
        sender.username as sender_name, 
        recipient.username as recipient_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      WHERE m.sender_id = ? OR m.recipient_id = ?
      ORDER BY m.created_at DESC`,
      [userId, userId]
    );
    console.log("Messages fetched:", messages);
    res.render("messages", { messages, user: req.session.user });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages");
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
