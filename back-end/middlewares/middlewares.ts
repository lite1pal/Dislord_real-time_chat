// third-party modules
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";

const TOKEN_KEY = process.env.TOKEN_KEY as string;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json("There is no token");
    const isToken = jwt.verify(token, TOKEN_KEY);
    if (!isToken) {
      return res.status(400).json(`Invalid token or no token at all`);
    }
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("token");
    return res.status(400).json(`Log in to go on`);
  }
};

export const validateInputCreateUser = [
  body("username").notEmpty().withMessage("Username is required."),
  body("age")
    .notEmpty()
    .withMessage("Age is required.")
    .isNumeric()
    .withMessage("Invalid type"),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must to be at least 8 characters"),
];

export const validateInputLoginUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must to be at least 8 characters"),
  body("remember")
    .isBoolean()
    .withMessage("Remember has to be a boolean value"),
];
