//third-party modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");

const { query } = require("../database/db");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashed_password) => {
  const isValidPassword = await bcrypt.compare(password, hashed_password);
  return isValidPassword;
};

const generateToken = async (user_id, email, remember) => {
  return jwt.sign(
    { user_id, email },
    process.env.TOKEN_KEY,
    remember ? {} : { expiresIn: 600 }
  );
};

const updateUserToken = async (token, user_id) => {
  await query({
    text: "UPDATE users SET token = $1 WHERE id = $2",
    values: [token, user_id],
  });
};

const createNewUser = async (username, email, age, hashedPassword) => {
  const result = await query({
    text: `INSERT INTO users (username, email, age, hashed_password, token) 
      VALUES ($1, $2, $3, $4, '1') RETURNING *`,
    values: [username, email, age, hashedPassword],
  });
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await query({
    text: `SELECT id, username, hashed_password FROM users WHERE email = $1`,
    values: [email],
  });
  return result.rows[0];
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  updateUserToken,
  createNewUser,
  getUserByEmail,
};
