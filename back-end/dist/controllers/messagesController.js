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
exports.sendMessage = exports.getMessagesOfChat = void 0;
const messageModel_1 = require("../models/messageModel");
const getMessagesOfChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const chatMessages = yield messageModel_1.Message.findAll({ where: { chat_id: chatId } });
        return res.status(200).json(chatMessages);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(`Error retrieving messages from the chat`);
    }
});
exports.getMessagesOfChat = getMessagesOfChat;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, chat_id, user_name } = req.body;
        const message = req.body.message.replace(/'/g, "''");
        if (!user_id || !chat_id || !message || !user_name) {
            return res
                .status(400)
                .json(`Body data is not complete. Check what body values you sent as a request`);
        }
        // const result = await pool.query({
        //   text: `
        // INSERT INTO messages (user_id, chat_id, message, user_name, sent_at)
        // VALUES ($1, $2, $3, $4, $5)
        // RETURNING message_id
        // `,
        //   values: [user_id, chat_id, message, user_name, sent_at],
        // });
        const newMessage = yield messageModel_1.Message.create({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(`Error sending the message`);
    }
});
exports.sendMessage = sendMessage;
