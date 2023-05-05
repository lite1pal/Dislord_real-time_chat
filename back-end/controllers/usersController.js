// third-party modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// requires query func to write queries for database
const { query } = require("../database/db");

// my functions to make a code more readable
const {
  hashPassword,
  comparePassword,
  generateToken,
  updateUserToken,
  createNewUser,
  getUserByEmail,
} = require("../helpers/utils");

// retrieves users from the database
const getUsers = async (req, res) => {
  /* try/catch helps to see what errors occured during async functions
     and fix them quickly as you know what a problem is */
  try {
    // retrieves row data of users using async query function
    const { rows } = await query(
      `SELECT id, username, email, age, logged_in FROM users`
    );

    if (rows.length <= 0) return res.status(404).json(`There are no users`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving users from the database`);
  }
};

// Retrieves a single user from the Postgres database based on the provided id
const getUserById = async (req, res, next) => {
  try {
    // extracts userId from req.params using destructuring assignment
    const { userId } = req.params;

    // retrieves the user from the database with specific id
    const { rows } = await query({
      text: `SELECT * FROM users WHERE id = $1`,
      values: [userId],
    });

    if (rows.length <= 0) return res.sendStatus(404);
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving the user from database`);
  }
};

// Updates a single user in the Postgres database based on the provided id
const updateUserById = async (req, res) => {
  try {
    const { name, email, age, userId } = req.params;
    if (!name || !email || !age) {
      return res.status(400).json(`There are no all required fields in query`);
    }

    await query({
      text: `UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4`,
      values: [name, email, age, userId],
    });

    res.status(200).json();
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error updating the user in database`);
  }
};

// creates a new user
const createUser = async (req, res) => {
  try {
    const { username, email, age, password } = req.body;

    // handles errors of the express-validator's middleware
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // hashes the password
    const hashedPassword = await hashPassword(password);

    // create a new user in database
    const newUser = await createNewUser(username, email, age, hashedPassword);

    // generates a new token to identificate the user
    const token = await generateToken(newUser.id, email);

    // updates user's token in the database
    await updateUserToken(token, newUser.id);

    return res.status(200).json(token);
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error creating the user`);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    const { id, username, hashed_password } = await getUserByEmail(email);

    if (!id || !username || !hashed_password) {
      return res.status(404).json(`Some of the select data is empty`);
    }

    // compares the provided password with the database password
    const isValidPassword = await comparePassword(password, hashed_password);

    if (!isValidPassword) {
      return res.status(400).json(`Invalid password`);
    }

    // generates a new token
    const token = await generateToken(id, email, remember);

    // updates the user's token in the database
    await updateUserToken(token, id);

    res.status(200).json({
      token: token,
      user: { id: id, username: username, email: email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error logging the user in");
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  createUser,
  loginUser,
};
