const express = require("express");
const chatsRouter = express.Router();

const { getChatsOfUser, createChat } = require("../database/db");
const { auth } = require("../utils");

chatsRouter.get("/:user_id", auth, getChatsOfUser);

chatsRouter.post("/:user1_id/:user2_id", auth, createChat);

module.exports = chatsRouter;
