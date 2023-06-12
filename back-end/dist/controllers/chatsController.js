"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeChat = exports.createChat = exports.getChatsOfUser = void 0;
const chatModel_1 = require("../models/chatModel");
const sequelize_1 = require("sequelize");
const messageModel_1 = require("../models/messageModel");
const getChatsOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const chats = yield chatModel_1.Chat.findAll({
            where: {
                [sequelize_1.Op.or]: {
                    user1_id: {
                        [sequelize_1.Op.eq]: user_id,
                    },
                    user2_id: {
                        [sequelize_1.Op.eq]: user_id,
                    },
                },
            },
        });
        // if (result.rows.length === 0) {
        //   return res.status(400).json(`There are no chats with this user`);
        // }
        // const chats = result.rows;
        res.status(200).json(chats);
    }
    catch (error) {
        res
            .status(500)
            .json(`Error retrieving the data of the user from the 'chats' table `);
    }
});
exports.getChatsOfUser = getChatsOfUser;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newChat = yield chatModel_1.Chat.create({ user1_id, user2_id, chat_name });
        // res.status(200).json({
        //   chat_id: newChat.dataValues.id,
        //   user1_id: req.params.user1_id,
        //   user2_id: req.params.user2_id,
        //   chat_name: chat_name,
        // });
        return res.status(200).json(newChat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(`Error creating a new chat`);
    }
});
exports.createChat = createChat;
const removeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = req.body;
        console.log(chat);
        if (!chat)
            return res.status(400).json(`Chat was not provided`);
        if (!chat.id)
            return res.status(400).json(`Chat's id is missing`);
        //     await pool.query({
        //       text: `
        //     DELETE FROM messages
        //     WHERE chat_id = $1
        // `,
        //       values: [chat.chat_id],
        //     });
        yield messageModel_1.Message.destroy({ where: { chat_id: chat.id } });
        // await pool.query({
        //   text: `DELETE FROM chats
        // WHERE chat_id = $1`,
        //   values: [chat.chat_id],
        // });
        yield chatModel_1.Chat.destroy({ where: { id: chat.id } });
        res.status(200).json(`Chat ${chat.chat_name} is removed`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error removing a chat from the database`);
    }
});
exports.removeChat = removeChat;
