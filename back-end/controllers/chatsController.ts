import { pool } from "../database/db";
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
    //   const result = await pool.query({
    //     text: `
    //   SELECT * FROM chats
    //   WHERE user1_id = $1 OR user2_id = $1
    // `,
    //     values: [user_id],
    //   });

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

    // if (result.rows.length === 0) {
    //   return res.status(400).json(`There are no chats with this user`);
    // }
    // const chats = result.rows;
    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json(`Error retrieving the data of the user from the 'chats' table `);
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const { user1_name, user2_name } = req.body;

    if (!user1_name || !user2_name)
      return res.status(400).json(`Some of the username is missed in body`);

    if (!req.params.user1_id || !req.params.user2_id)
      return res.status(400).json(`Some of the id is not provided in params`);

    if (req.params.user1_id === req.params.user2_id)
      return res.status(400).json(`User cannot create a chat with himself`);

    const chat_name = `${user1_name}, ${user2_name}`;
    const { user1_id, user2_id } = req.params;
    // const result = await pool.query({
    //   text: `
    // INSERT INTO chats (user1_id, user2_id, chat_name)
    // VALUES ($1, $2, $3)
    // RETURNING chat_id
    // `,
    //   values: [user1_id, user2_id, chat_name],
    // });
    // const newChat_id = result.rows[0].chat_id;

    const newChat = await Chat.create({ user1_id, user2_id, chat_name });
    // res.status(200).json({
    //   chat_id: newChat.dataValues.id,
    //   user1_id: req.params.user1_id,
    //   user2_id: req.params.user2_id,
    //   chat_name: chat_name,
    // });
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
    //     await pool.query({
    //       text: `
    //     DELETE FROM messages
    //     WHERE chat_id = $1
    // `,
    //       values: [chat.chat_id],
    //     });

    await Message.destroy({ where: { chat_id: chat.id } });

    // await pool.query({
    //   text: `DELETE FROM chats
    // WHERE chat_id = $1`,
    //   values: [chat.chat_id],
    // });
    await Chat.destroy({ where: { id: chat.id } });
    res.status(200).json(`Chat ${chat.chat_name} is removed`);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error removing a chat from the database`);
  }
};
