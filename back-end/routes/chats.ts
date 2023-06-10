import express from "express";
const chatsRouter = express.Router();

import {
  getChatsOfUser,
  createChat,
  removeChat,
} from "../controllers/chatsController";
import { auth } from "../middlewares/middlewares";

chatsRouter.get("/:user_id", auth, getChatsOfUser);

chatsRouter.post("/:user1_id/:user2_id", auth, createChat);

chatsRouter.delete("/delete", auth, removeChat);

export default chatsRouter;
