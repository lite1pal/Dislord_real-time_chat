const express = require("express");
const usersRouter = express.Router();

// my middlewares
const {
  auth,
  validateInputCreateUser,
  validateInputLoginUser,
} = require("../middlewares/middlewares");

const {
  getUsers,
  getUserById,
  updateUserById,
  createUser,
  loginUser,
} = require("../controllers/usersController");

usersRouter.get("/:userId", getUserById);

usersRouter.get("/", getUsers);

usersRouter.put("/:userId", updateUserById);

usersRouter.post("/signup", validateInputCreateUser, createUser);

usersRouter.post("/login", validateInputLoginUser, loginUser);

module.exports = usersRouter;
