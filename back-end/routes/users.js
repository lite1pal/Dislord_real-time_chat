const express = require("express");
const usersRouter = express.Router();

const { auth } = require("../middlewares/auth");
const {
  getUsers,
  getSingleUser,
  updateSingleUser,
  signUpUser,
  logInUser,
} = require("../controllers/usersController");

usersRouter.get("/:userId", getSingleUser);

usersRouter.get("/", getUsers);

usersRouter.put("/:userId", updateSingleUser);

usersRouter.post("/signup", signUpUser);

usersRouter.post("/login", logInUser);

module.exports = usersRouter;
