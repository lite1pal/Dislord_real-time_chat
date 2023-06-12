//third-party modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check } from "express-validator";
import { pool } from "../database/db";

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

export const updateUserToken = async (token: string, user_id: any) => {
  await pool.query({
    text: "UPDATE users SET token = $1 WHERE id = $2",
    values: [token, user_id],
  });
};

export const createNewUser = async (
  username: string,
  email: string,
  age: number,
  hashedPassword: string
) => {
  const result = await pool.query({
    text: `INSERT INTO users (username, email, age, hashed_password, token) 
      VALUES ($1, $2, $3, $4, '1') RETURNING *`,
    values: [username, email, age, hashedPassword],
  });
  return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await pool.query({
    text: `SELECT id, username, hashed_password FROM users WHERE email = $1`,
    values: [email],
  });
  return result.rows[0];
};
