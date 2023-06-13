//third-party modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check } from "express-validator";

const TOKEN_KEY = process.env.TOKEN_KEY as string;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashed_password: string
) => {
  const isValidPassword = await bcrypt.compare(password, hashed_password);
  return isValidPassword;
};

export const generateToken = async (
  user_id: number,
  email: string,
  remember: boolean = false
) => {
  return jwt.sign(
    { user_id, email },
    TOKEN_KEY,
    remember ? {} : { expiresIn: 600 }
  );
};
