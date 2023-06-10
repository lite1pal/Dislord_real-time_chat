"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagesRouter = express_1.default.Router();
const messagesController_1 = require("../controllers/messagesController");
const middlewares_1 = require("../middlewares/middlewares");
messagesRouter.get("/:chatId", middlewares_1.auth, messagesController_1.getMessagesOfChat);
messagesRouter.post("/:chatId/:userId", middlewares_1.auth, messagesController_1.sendMessage);
exports.default = messagesRouter;
