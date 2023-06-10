"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const friendsRouter = express_1.default.Router();
const friendsController_1 = require("../controllers/friendsController");
friendsRouter.get("/:user_id", friendsController_1.getFriendsOfUser);
friendsRouter.post("/add_friend", friendsController_1.sendFriendRequest);
friendsRouter.delete("/remove_friend", friendsController_1.removeFriend);
exports.default = friendsRouter;
