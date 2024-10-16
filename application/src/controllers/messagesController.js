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
    const result = await pool.query(
      "INSERT INTO messages (sender_id, recipient_id, message) VALUES (?, ?, ?)",
      [senderId, recipientId, message]
    );
    console.log("Message sent successfully. Insert result:", result);
    res.status(200).json({ message: "Message sent successfully" }); // Send a JSON response
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const pool = await getPool();

    const [messages] = await pool.query(
      `SELECT m.*, 
        CASE 
          WHEN m.sender_id = ? THEN r.username 
          ELSE s.username 
        END AS other_user_name,
        CASE 
          WHEN m.sender_id = ? THEN r.id 
          ELSE s.id 
        END AS other_user_id
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      JOIN users r ON m.recipient_id = r.id
      WHERE m.sender_id = ? OR m.recipient_id = ?
      ORDER BY m.created_at ASC`,
      [userId, userId, userId, userId]
    );

    const conversations = messages.reduce((acc, message) => {
      const otherUserId = message.other_user_id;
      if (!acc[otherUserId]) {
        acc[otherUserId] = { name: message.other_user_name, messages: [] };
      }
      acc[otherUserId].messages.push(message);
      return acc;
    }, {});

    res.locals.conversations = conversations;
    res.locals.currentUserId = userId;
    res.render("profile", { user: req.session.user });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages");
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
