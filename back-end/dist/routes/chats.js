"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatsRouter = express_1.default.Router();
const chatsController_1 = require("../controllers/chatsController");
const middlewares_1 = require("../middlewares/middlewares");
chatsRouter.get("/:user_id", middlewares_1.auth, chatsController_1.getChatsOfUser);
chatsRouter.post("/:user1_id/:user2_id", middlewares_1.auth, chatsController_1.createChat);
chatsRouter.delete("/delete", middlewares_1.auth, chatsController_1.removeChat);
exports.default = chatsRouter;
