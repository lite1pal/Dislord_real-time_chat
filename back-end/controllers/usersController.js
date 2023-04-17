const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isPasswordValid } = require("../middlewares/passportValidation");
const { query } = require("../database/db");

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
const getSingleUser = async (req, res, next) => {
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
const updateSingleUser = async (req, res) => {
  try {
    if (!req.params.name || !req.params.email || !req.params.age) {
      return res.status(400).json(`There are no all required fields in query`);
    }

    const { name, email, age, userId } = req.params;

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

// Creates a new user, stores it in the Postgres database and signs up a new token that will identify a user afterwards.
const signUpUser = async (req, res) => {
  try {
    const { username, email, age, password } = req.body;

    // error handling if there were no all inputs provided
    if (!username || !email || !age || !password)
      return res.status(400).json(`All inputs are required`);

    //check if the provided password do not have less than 8 chars
    if (!isPasswordValid(password))
      return res.status(400).json(`Password has to be 8 chars or higher`);
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user in database
    await query({
      text: `INSERT INTO users (username, email, age, hashed_password, token) 
    VALUES ($1, $2, $3, $4, '1')`,
      values: [username, email, age, hashedPassword],
    });
    const { rows } = await query({
      text: `
    SELECT *
    FROM users
    WHERE email = $1
            `,
      values: [email],
    });
    const newUser = rows[0];
    const token = jwt.sign(
      { user_id: newUser.id, email },
      process.env.TOKEN_KEY
    );
    if (!token)
      return res.status(400).json(`Error occured during signing a new token`);
    await query({
      text: `UPDATE users SET token = $1 WHERE id = $2`,
      values: [token, newUser.id],
    });
    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error creating the user`);
  }
};

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(`All inputs are required`);
    }
    const result = await query({
      text: `SELECT id, username, hashed_password FROM users WHERE email = $1`,
      values: [email],
    });
    if (result.rows.length === 0) {
      return res.status(400).json(`Invalid email`);
    }
    const { id, username, hashed_password } = result.rows[0];
    if (!id || !username || !hashed_password) {
      return res.status(400).json(`Some of the select data is empty`);
    }
    const validPass = await bcrypt.compare(password, hashed_password);

    if (!validPass) {
      return res.status(400).json(`Invalid password`);
    }
    const token = jwt.sign({ user_id: id, email }, process.env.TOKEN_KEY);
    if (!token) {
      return res.status(400).json(`Error occured during signing a new token`);
    }
    await query({
      text: `
    UPDATE users
    SET token = $1, logged_in = true
    WHERE email = $2`,
      values: [token, email],
    });
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
  getSingleUser,
  updateSingleUser,
  signUpUser,
  logInUser,
};
