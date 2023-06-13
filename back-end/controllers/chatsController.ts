import { Request, Response } from "express";

import { Chat } from "../models/chatModel";
import { Op, Sequelize } from "sequelize";
import { Message } from "../models/messageModel";

export const getChatsOfUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json("user_id is missing from req.params");
    }

    const chats = await Chat.findAll({
      where: {
        [Op.or]: {
          user1_id: {
            [Op.eq]: user_id,
          },
          user2_id: {
            [Op.eq]: user_id,
          },
        },
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json(`Error retrieving the data of the user from the 'chats' table `);
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const { user1_name, user2_name, user1_avatar_url, user2_avatar_url } =
      req.body;

    if (!user1_name || !user2_name || !user1_avatar_url || !user2_avatar_url)
      return res.status(400).json(`Some of the body values are missing`);

    if (!req.params.user1_id || !req.params.user2_id)
      return res.status(400).json(`Some of the id is not provided in params`);

    if (req.params.user1_id === req.params.user2_id)
      return res.status(400).json(`User cannot create a chat with himself`);

    const chat_name = `${user1_name}, ${user2_name}`;
    const { user1_id, user2_id } = req.params;
    const newChat = await Chat.create({
      user1_id,
      user2_id,
      chat_name,
      user1_avatar_url,
      user2_avatar_url,
    });

    return res.status(200).json(newChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error creating a new chat`);
  }
};

export const removeChat = async (req: Request, res: Response) => {
  try {
    const chat = req.body;
    console.log(chat);
    if (!chat) return res.status(400).json(`Chat was not provided`);
    if (!chat.id) return res.status(400).json(`Chat's id is missing`);

    await Message.destroy({ where: { chat_id: chat.id } });
    await Chat.destroy({ where: { id: chat.id } });
    res.status(200).json(`Chat ${chat.chat_name} is removed`);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error removing a chat from the database`);
  }
};
