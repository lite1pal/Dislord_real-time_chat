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
exports.removeChat = exports.createChat = exports.getChatsOfUser = void 0;
const db_1 = __importDefault(require("../database/db"));
const getChatsOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json("user_id is missing from req.params");
        }
        const result = yield (0, db_1.default)({
            text: `
    SELECT * FROM chats
    WHERE user1_id = $1 OR user2_id = $1
  `,
            values: [user_id],
        });
        if (result.rows.length === 0) {
            return res.status(400).json(`There are no chats with this user`);
        }
        const chats = result.rows;
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
        const result = yield (0, db_1.default)({
            text: `
    INSERT INTO chats (user1_id, user2_id, chat_name)
    VALUES ($1, $2, $3)
    RETURNING chat_id
    `,
            values: [user1_id, user2_id, chat_name],
        });
        const newChat_id = result.rows[0].chat_id;
        res.status(200).json({
            chat_id: newChat_id,
            user1_id: req.params.user1_id,
            user2_id: req.params.user2_id,
            chat_name: chat_name,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error creating a new chat`);
    }
});
exports.createChat = createChat;
const removeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = req.body;
        if (!chat)
            return res.status(400).json(`Chat was not provided`);
        if (!chat.chat_id)
            return res.status(400).json(`Chat's id is missing`);
        yield (0, db_1.default)({
            text: `
    DELETE FROM messages
    WHERE chat_id = $1
`,
            values: [chat.chat_id],
        });
        yield (0, db_1.default)({
            text: `DELETE FROM chats
    WHERE chat_id = $1`,
            values: [chat.chat_id],
        });
        res.status(200).json(`Chat ${chat.chat_name} is removed`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(`Error removing a chat from the database`);
    }
});
exports.removeChat = removeChat;
