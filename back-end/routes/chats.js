const express = require("express");
const chatsRouter = express.Router();

const { getChatsOfUser, createChat } = require("../database/db");
const { auth } = require("../utils");

chatsRouter.get("/:user_id", getChatsOfUser);

chatsRouter.post("/:user1_id/:user2_id", createChat);

module.exports = chatsRouter;
