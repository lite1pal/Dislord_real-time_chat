const express = require("express");
const messagesRouter = express.Router();
const { getMessagesOfChat, sendMessage } = require("../database/db");
const { auth } = require("../utils");

messagesRouter.get("/:chatId", getMessagesOfChat);

messagesRouter.post("/:chatId/:userId", sendMessage);

module.exports = messagesRouter;
