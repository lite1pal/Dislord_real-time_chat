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
      res.status(404).send(`There are no users`);
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
      res.sendStatus(404);
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
      res.status(400).send(`There are no all required fields in query`);
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
      res.status(400).send(`All inputs are required`);
    }
    //check if the provided password do not have less than 8 chars
    if (!isPasswordValid(password)) {
      res.status(400).send(`Password has to be 8 chars or higher`);
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
    res.status(500).send(`Error creating the user`);
  }
};

const logInUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send(`All inputs are required`);
    }
    const result = await query(
      `SELECT id, username, hashed_password FROM users WHERE email = '${email}'`
    );
    const { id, username, hashed_password } = result.rows[0];
    // console.log(
    //   11111111111111111111111111111111111111111111111111111111111111,
    //   result.rows[0]
    // );
    console.log(result.rows);
    const validPass = await bcrypt.compare(password, hashed_password);

    if (!validPass) {
      res.status(400).send(`Password is not valid`);
    }
    const token = jwt.sign({ user_id: id, email }, process.env.TOKEN_KEY);
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
    res.status(500).send("Error logging the user in");
  }
};

const getChats = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM chats`);
    res.send(result.rows);
  } catch (error) {
    res.status(500).send(`Error retrieving the data from the 'chats' table`);
  }
};

const getChatsOfUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      res.status(400).send("There is no id of the user");
    }
    const result = await query(`
      SELECT * FROM chats
      WHERE user1_id = ${user_id} OR user2_id = ${user_id}
    `);
    const chats = result.rows;
    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .send(`Error retrieving the data of the user from the 'chats' table `);
  }
};

const createChat = async (req, res) => {
  try {
    const users = await query(`
            SELECT *
            FROM users
            WHERE id IN (${req.params.user1_id}, ${req.params.user2_id})
        `);
    console.log(users.rows);
    if (users.length < 2) {
      res.status(400).send("Some of two users does not exist");
    }
    await query(`
        INSERT INTO chats (user1_id, user2_id, chat_name)
        VALUES (${req.params.user1_id}, ${req.params.user2_id}, '${users.rows[0].username}, ${users.rows[1].username}')`);
    res.status(200).send(`Chat was successfully created`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error creating a new chat`);
  }
};

const getMessagesOfChat = async (req, res, next) => {
  try {
    const chatMessages = await query(`
        SELECT *
        FROM messages
        WHERE chat_id = ${req.params.chatId}
        `);
    res.status(200).json(chatMessages.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving messages from the chat`);
  }
};

const sendMessage = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body) {
      const { user_id, chat_id, message } = req.body;
      const response = await query(
        `SELECT username FROM users WHERE id = ${user_id}`
      );
      const { username } = response.rows[0];
      console.log(user_id, chat_id, message, username);
      await query(`
            INSERT INTO messages (user_id, chat_id, message, user_name)
            VALUES (${user_id}, ${chat_id}, '${message}', '${username}')
            `);
      res.status(200).json({ user_id, chat_id, message, username });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error sending the message`);
  }
};

module.exports = {
  getUsers: getUsers,
  getSingleUser: getSingleUser,
  updateSingleUser: updateSingleUser,
  getChats: getChats,
  getChatsOfUser: getChatsOfUser,
  createChat: createChat,
  signUpUser: signUpUser,
  logInUser: logInUser,
  getMessagesOfChat: getMessagesOfChat,
  sendMessage: sendMessage,
};
