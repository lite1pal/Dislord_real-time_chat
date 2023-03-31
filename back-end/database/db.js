const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isPasswordValid } = require("../utils");
require("dotenv").config();

// Creates the connection between the Postgres database and the NodeJS server.
const pool = new Pool({
  user: "lite1pal",
  host: "ep-long-field-822683.eu-central-1.aws.neon.tech",
  database: "neondb",
  password: "nqhN2YELgU8e",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

// Returns the query's response
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

// Retrieves users from the Postgres database
const getUsers = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, username, email, age, logged_in FROM users`
    );
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      return res.status(404).send(`There are no users`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving users from the database`);
  }
};

// Retrieves a single user from the Postgres database based on the provided id
const getSingleUser = async (req, res, next) => {
  try {
    const { rows } = await query(
      `
            SELECT *
            FROM users
            WHERE id = ${parseInt(req.params.userId)}`
    );
    if (rows.length > 0) {
      res.status(200).send(rows[0]);
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving the user from database`);
  }
};

// Updates a single user in the Postgres database based on the provided id
const updateSingleUser = async (req, res) => {
  try {
    if (req.query.name && req.query.email && req.query.age) {
      await query(
        `
            UPDATE users
            SET name = '${req.query.name}',
            email = '${req.query.email}',
            age = ${req.query.age}
            WHERE id = ${req.params.userId}`
      );
      res.status(200).send();
    } else {
      return res.status(400).send(`There are no all required fields in query`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error updating the user in database`);
  }
};

// Creates a new user, stores it in the Postgres database and signs up a new token that will identify a user afterwards.
const signUpUser = async (req, res) => {
  try {
    const { username, email, age, password } = req.body;

    // error handling if there were no all inputs provided
    if (!(username && email && age && password)) {
      return res.status(400).json(`All inputs are required`);
    }
    //check if the provided password do not have less than 8 chars
    if (!isPasswordValid(password)) {
      return res.status(400).json(`Password has to be 8 chars or higher`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user in database
    await query(`
                INSERT INTO users (username, email, age, hashed_password, token)
                VALUES ('${username}', '${email}', ${age}, '${hashedPassword}', '1')`);
    const { rows } = await query(`
        SELECT *
                FROM users
                WHERE email = '${email}'
                `);
    const newUser = rows[0];
    const token = jwt.sign(
      { user_id: newUser.id, email },
      process.env.TOKEN_KEY
    );
    await query(`
        UPDATE users
                SET token = '${token}'
                WHERE id = ${newUser.id}
        `);
    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error creating the user`);
  }
};

const logInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json(`All inputs are required`);
    }
    const result = await query(
      `SELECT id, username, hashed_password FROM users WHERE email = '${email}'`
    );
    if (result.rows.length === 0) {
      return res.status(400).json(`Invalid email`);
    }
    const { id, username, hashed_password } = result.rows[0];
    if (!(id && username && hashed_password)) {
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
    await query(`
        UPDATE users
        SET token = '${token}', logged_in = true
        WHERE email = '${email}'`);
    res.status(200).json({
      token: token,
      user: { id: id, username: username, email: email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error logging the user in");
  }
};

const getChatsOfUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json("There is no id of the user");
    }
    const result = await query(`
      SELECT * FROM chats
      WHERE user1_id = ${user_id} OR user2_id = ${user_id}
    `);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(400).json(`There are no chats with this user`);
    }
    const chats = result.rows;
    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json(`Error retrieving the data of the user from the 'chats' table `);
  }
};

const createChat = async (req, res) => {
  try {
    if (!(req.params.user1_id && req.params.user2_id)) {
      return res.status(400).json(`Some of users is not provided`);
    }
    const users = await query(`
            SELECT *
            FROM users
            WHERE id IN (${req.params.user1_id}, ${req.params.user2_id})
        `);
    if (users.rows.length < 2) {
      return res.status(400).json("Some of two users does not exist");
    }
    const chat_name = `${users.rows[0].username}, ${users.rows[1].username}`;
    await query(`
        INSERT INTO chats (user1_id, user2_id, chat_name)
        VALUES (${req.params.user1_id}, ${req.params.user2_id}, '${chat_name}')`);
    res.status(200).json({
      user1_id: req.params.user1_id,
      user2_id: req.params.user2_id,
      chat_name: chat_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error creating a new chat`);
  }
};

const getMessagesOfChat = async (req, res, next) => {
  try {
    if (!req.params.chatId) {
      return res.status(400).json(`Chat_id is not provided`);
    }
    const chatMessages = await query(`
        SELECT *
        FROM messages
        WHERE chat_id = ${req.params.chatId}
        `);
    res.status(200).json(chatMessages.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error retrieving messages from the chat`);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { user_id, chat_id, message } = req.body;
    if (!(user_id && chat_id && message)) {
      return res
        .status(400)
        .json(
          `Body data is not complete. Check what body values you sent as a request`
        );
    }
    const response = await query(
      `SELECT username FROM users WHERE id = ${user_id}`
    );
    const { username } = response.rows[0];
    if (!username) {
      return res.status(400).json(`There is no such user in database`);
    }
    await query(`
            INSERT INTO messages (user_id, chat_id, message, user_name)
            VALUES (${user_id}, ${chat_id}, '${message}', '${username}')
            `);
    res.status(200).json({ user_id, chat_id, message, username });
  } catch (error) {
    console.error(error);
    res.status(500).json(`Error sending the message`);
  }
};

module.exports = {
  getUsers: getUsers,
  getSingleUser: getSingleUser,
  updateSingleUser: updateSingleUser,
  getChatsOfUser: getChatsOfUser,
  createChat: createChat,
  signUpUser: signUpUser,
  logInUser: logInUser,
  getMessagesOfChat: getMessagesOfChat,
  sendMessage: sendMessage,
};
