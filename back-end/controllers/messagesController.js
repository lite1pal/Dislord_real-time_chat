const { query } = require("../database/db");

const getMessagesOfChat = async (req, res) => {
  try {
    if (!req.params.chatId) {
      return res.status(400).json(`Chat_id is not provided`);
    }
    const { chatId } = req.params;
    const chatMessages = await query({
      text: `
    SELECT *
    FROM messages
    WHERE chat_id = $1
    `,
      values: [chatId],
    });
    res.status(200).json(chatMessages.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error retrieving messages from the chat`);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { user_id, chat_id, user_name, sent_at } = req.body;
    const message = req.body.message.replace(/'/g, "''");
    if (!user_id || !chat_id || !message || !user_name || !sent_at) {
      return res
        .status(400)
        .json(
          `Body data is not complete. Check what body values you sent as a request`
        );
    }
    const result = await query({
      text: `
    INSERT INTO messages (user_id, chat_id, message, user_name, sent_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING message_id
    `,
      values: [user_id, chat_id, message, user_name, sent_at],
    });
    const message_id = result.rows[0].message_id;
    res
      .status(200)
      .json({ message_id, user_id, chat_id, message, user_name, sent_at });
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error sending the message`);
  }
};

module.exports = { getMessagesOfChat, sendMessage };
