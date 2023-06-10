import express from "express";
const messagesRouter = express.Router();
import {
  getMessagesOfChat,
  sendMessage,
} from "../controllers/messagesController";
import { auth } from "../middlewares/middlewares";

messagesRouter.get("/:chatId", auth, getMessagesOfChat);

messagesRouter.post("/:chatId/:userId", auth, sendMessage);

export default messagesRouter;
