const express = require("express");
const chatsRouter = express.Router();

const {
  getChatsOfUser,
  createChat,
  removeChat,
} = require("../controllers/chatsController");
const { auth } = require("../middlewares/auth");

chatsRouter.get("/:user_id", auth, getChatsOfUser);

chatsRouter.post("/:user1_id/:user2_id", auth, createChat);

chatsRouter.delete("/delete", auth, removeChat);

module.exports = chatsRouter;
