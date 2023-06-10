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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessagesOfChat = void 0;
const db_1 = __importDefault(require("../database/db"));
const getMessagesOfChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.chatId) {
            return res.status(400).json(`Chat_id is not provided`);
        }
        const { chatId } = req.params;
        const chatMessages = yield (0, db_1.default)({
            text: `
    SELECT *
    FROM messages
    WHERE chat_id = $1
    `,
            values: [chatId],
        });
        res.status(200).json(chatMessages.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error retrieving messages from the chat`);
    }
});
exports.getMessagesOfChat = getMessagesOfChat;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, chat_id, user_name, sent_at } = req.body;
        const message = req.body.message.replace(/'/g, "''");
        if (!user_id || !chat_id || !message || !user_name || !sent_at) {
            return res
                .status(400)
                .json(`Body data is not complete. Check what body values you sent as a request`);
        }
        const result = yield (0, db_1.default)({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error sending the message`);
    }
});
exports.sendMessage = sendMessage;
