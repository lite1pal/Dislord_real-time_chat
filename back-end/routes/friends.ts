import express from "express";
const friendsRouter = express.Router();
import { auth } from "../middlewares/middlewares";
import {
  getFriendsOfUser,
  sendFriendRequest,
  removeFriend,
} from "../controllers/friendsController";

friendsRouter.get("/:user_id", getFriendsOfUser);

friendsRouter.post("/add_friend", sendFriendRequest);

friendsRouter.delete("/remove_friend", removeFriend);

export default friendsRouter;
