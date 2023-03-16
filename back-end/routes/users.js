const express = require('express');
const bcrypt = require('bcrypt');
const usersRouter = express.Router();

const { isPasswordValid, auth } = require('../utils');
const { query, getUsers, getSingleUser, updateSingleUser } = require('../db');

const jwt = require('jsonwebtoken');

usersRouter.get('/:userId', auth, getSingleUser);

usersRouter.get('/', auth, getUsers);

usersRouter.put('/:userId', updateSingleUser);

usersRouter.post('/signup', async (req, res) => {
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
            process.env.TOKEN_KEY,
            {
                expiresIn: 600
            }
        );
        res.cookie("token", token, {
            httpOnly: true
        });
        await query(`
                UPDATE users
                SET token = '${token}'
                WHERE id = ${newUser.id}
        `);
        res.status(200).send(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error creating the user`);
    }
})

usersRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send(`All inputs are required`);
        }
        const result = await query(`SELECT id username, hashed_password FROM users WHERE email = '${email}'`);
        const { userId, username, hashed_password } = result.rows[0];
        const validPass = await bcrypt.compare(password, hashed_password);

        if (!validPass) {
            res.status(400).send(`Password is not valid`);
        }
        const token = jwt.sign(
            { user_id: userId, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: 600
            }
        );
        res.cookie("token", token, {
            httpOnly: true
        });
        await query(`
                UPDATE users
                SET token = '${token}'
                WHERE email = '${email}'`);
        res.status(200).send(`The user ${username} was logged_in!`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error logging the user in');
    }
})

module.exports = usersRouter;