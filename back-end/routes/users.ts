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
  authGoogle,
  deleteUser,
} from "../controllers/usersController";

usersRouter.get("/:userId", auth, getUserById);

usersRouter.get("/", auth, getUsers);

usersRouter.put("/:userId", auth, updateUserById);

usersRouter.post("/signup", validateInputCreateUser, createUser);

usersRouter.post("/login", validateInputLoginUser, loginUser);

usersRouter.post("/authGoogle", authGoogle);

usersRouter.delete("/delete/:user_id", auth, deleteUser);

export default usersRouter;
