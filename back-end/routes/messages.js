const express = require("express");
const messagesRouter = express.Router();
const {
  getMessagesOfChat,
  sendMessage,
} = require("../controllers/messagesController");
const { auth } = require("../middlewares/middlewares");

messagesRouter.get("/:chatId", auth, getMessagesOfChat);

messagesRouter.post("/:chatId/:userId", auth, sendMessage);

module.exports = messagesRouter;
