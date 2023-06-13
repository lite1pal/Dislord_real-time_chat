import { Request, Response } from "express";

import { Message } from "../models/messageModel";

export const getMessagesOfChat = async (req: Request, res: Response) => {
  try {
    if (!req.params.chatId) {
      return res.status(400).json(`Chat_id is not provided`);
    }
    const { chatId } = req.params;
    console.log("bad");
    const chatMessages = await Message.findAll({ where: { chat_id: chatId } });
    console.log("nice");
    return res.status(200).json(chatMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error retrieving messages from the chat`);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { user_id, chat_id, user_name, avatar_url } = req.body;
    const message = req.body.message.replace(/'/g, "''");
    if (!user_id || !chat_id || !message || !user_name || !avatar_url) {
      return res
        .status(400)
        .json(
          `Body data is not complete. Check what body values you sent as a request`
        );
    }

    const newMessage = await Message.create({
      user_id,
      chat_id,
      message,
      user_name,
      avatar_url,
    });
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error sending the message`);
  }
};
