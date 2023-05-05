const express = require("express");
const friendsRouter = express.Router();
const { auth } = require("../middlewares/middlewares");

const {
  getFriendsOfUser,
  sendFriendRequest,
  removeFriend,
} = require("../controllers/friendsController");

friendsRouter.get("/:user_id", getFriendsOfUser);

friendsRouter.post("/add_friend", sendFriendRequest);

friendsRouter.delete("/remove_friend", removeFriend);

module.exports = friendsRouter;
