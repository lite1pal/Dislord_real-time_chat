const express = require("express");
const messagesRouter = express.Router();
const { getMessagesOfChat, sendMessage } = require("../database/db");
const { auth } = require("../utils");

messagesRouter.get("/:chatId", auth, getMessagesOfChat);

messagesRouter.post("/:chatId/:userId", auth, sendMessage);

module.exports = messagesRouter;
