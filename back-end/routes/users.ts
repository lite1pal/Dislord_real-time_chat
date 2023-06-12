import express from "express";
const usersRouter = express.Router();

// my middlewares
import {
  auth,
  validateInputCreateUser,
  validateInputLoginUser,
} from "../middlewares/middlewares";

import {
  getUsers,
  getUserById,
  updateUserById,
  createUser,
  loginUser,
  deleteUser,
} from "../controllers/usersController";

usersRouter.get("/:userId", getUserById);

usersRouter.get("/", getUsers);

usersRouter.put("/:userId", updateUserById);

usersRouter.post("/signup", validateInputCreateUser, createUser);

usersRouter.post("/login", validateInputLoginUser, loginUser);

usersRouter.delete("/delete/:user_id", deleteUser);

export default usersRouter;
