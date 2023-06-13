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
        const { user1_name, user2_name, user1_avatar_url, user2_avatar_url } = req.body;
        if (!user1_name || !user2_name || !user1_avatar_url || !user2_avatar_url)
            return res.status(400).json(`Some of the body values are missing`);
        if (!req.params.user1_id || !req.params.user2_id)
            return res.status(400).json(`Some of the id is not provided in params`);
        if (req.params.user1_id === req.params.user2_id)
            return res.status(400).json(`User cannot create a chat with himself`);
        const chat_name = `${user1_name}, ${user2_name}`;
        const { user1_id, user2_id } = req.params;
        const newChat = yield chatModel_1.Chat.create({
            user1_id,
            user2_id,
            chat_name,
            user1_avatar_url,
            user2_avatar_url,
        });
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
        yield messageModel_1.Message.destroy({ where: { chat_id: chat.id } });
        yield chatModel_1.Chat.destroy({ where: { id: chat.id } });
        res.status(200).json(`Chat ${chat.chat_name} is removed`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error removing a chat from the database`);
    }
});
exports.removeChat = removeChat;
