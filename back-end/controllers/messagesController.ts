import { pool } from "../database/db";

import { Request, Response } from "express";

import { Message } from "../models/messageModel";

export const getMessagesOfChat = async (req: Request, res: Response) => {
  try {
    if (!req.params.chatId) {
      return res.status(400).json(`Chat_id is not provided`);
    }
    const { chatId } = req.params;
    // const chatMessages = await pool.query({
    //   text: `
    // SELECT *
    // FROM messages
    // WHERE chat_id = $1
    // `,
    //   values: [chatId],
    // });

    const chatMessages = await Message.findAll({ where: { chat_id: chatId } });
    return res.status(200).json(chatMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error retrieving messages from the chat`);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { user_id, chat_id, user_name } = req.body;
    const message = req.body.message.replace(/'/g, "''");
    if (!user_id || !chat_id || !message || !user_name) {
      return res
        .status(400)
        .json(
          `Body data is not complete. Check what body values you sent as a request`
        );
    }
    // const result = await pool.query({
    //   text: `
    // INSERT INTO messages (user_id, chat_id, message, user_name, sent_at)
    // VALUES ($1, $2, $3, $4, $5)
    // RETURNING message_id
    // `,
    //   values: [user_id, chat_id, message, user_name, sent_at],
    // });
    const newMessage = await Message.create({
      user_id,
      chat_id,
      message,
      user_name,
    });
    // const message_id = newMessage.dataValues.id;

    // return res.status(200).json({
    //   message_id,
    //   user_id,
    //   chat_id,
    //   message,
    //   user_name,
    //   sent_at: newMessage.dataValues.createdAt,
    // });
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error sending the message`);
  }
};
