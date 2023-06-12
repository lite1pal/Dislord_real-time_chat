"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
// my middlewares
const middlewares_1 = require("../middlewares/middlewares");
const usersController_1 = require("../controllers/usersController");
usersRouter.get("/:userId", usersController_1.getUserById);
usersRouter.get("/", usersController_1.getUsers);
usersRouter.put("/:userId", usersController_1.updateUserById);
usersRouter.post("/signup", middlewares_1.validateInputCreateUser, usersController_1.createUser);
usersRouter.post("/login", middlewares_1.validateInputLoginUser, usersController_1.loginUser);
usersRouter.delete("/delete/:user_id", usersController_1.deleteUser);
exports.default = usersRouter;
