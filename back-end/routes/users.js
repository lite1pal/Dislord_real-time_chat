const express = require("express");
const usersRouter = express.Router();

const { auth } = require("../utils");
const {
  getUsers,
  getSingleUser,
  updateSingleUser,
  signUpUser,
  logInUser,
} = require("../database/db");

usersRouter.get("/:userId", getSingleUser);

usersRouter.get("/", getUsers);

usersRouter.put("/:userId", updateSingleUser);

usersRouter.post("/signup", signUpUser);

usersRouter.post("/login", logInUser);

module.exports = usersRouter;
