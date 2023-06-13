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
        console.log("bad");
        const chatMessages = yield messageModel_1.Message.findAll({ where: { chat_id: chatId } });
        console.log("nice");
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
        const { user_id, chat_id, user_name, avatar_url } = req.body;
        const message = req.body.message.replace(/'/g, "''");
        if (!user_id || !chat_id || !message || !user_name || !avatar_url) {
            return res
                .status(400)
                .json(`Body data is not complete. Check what body values you sent as a request`);
        }
        const newMessage = yield messageModel_1.Message.create({
            user_id,
            chat_id,
            message,
            user_name,
            avatar_url,
        });
        return res.status(200).json(newMessage);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(`Error sending the message`);
    }
});
exports.sendMessage = sendMessage;
