const express = require('express');
const usersRouter = express.Router();

const isPasswordValid = require('./utils');
const db = require('./db');

usersRouter.param('userId', async (req, res, next, id) => {
    try {
        const user = await db.query(
            `
            SELECT *
            FROM users
            WHERE id = ${parseInt(id)}`);
        if (user.rows.length > 0) {
            req.user = user.rows[0];
        }
        else {
            res.sendStatus(404);
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving the user from database`);
    }
})

usersRouter.get('/:userId', (req, res) => {
    res.send(req.user);
})

usersRouter.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT username, email, age, logged_in FROM users');
        res.send(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the user from database');
    }
})

usersRouter.put('/:userId', async (req, res) => {
    try {
        if (req.query.name && req.query.email && req.query.age) {
            const result = await db.query(
                `
            UPDATE users
            SET name = '${req.query.name}',
            email = '${req.query.email}',
            age = ${req.query.age}
            WHERE id = ${req.user.id}`);
            res.status(200).send();
        }
        else {
            res.status(400).send(`There are no all required fields in query`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error updating the user in database`);
    }
})

usersRouter.post('/signup', async (req, res) => {
    try {
        if (req.body.username && req.body.email && req.body.age && req.body.password) {
            const { username, email, age, password } = req.body;

            //check if the provided password do not have less than 8 chars
            if (isPasswordValid(password)) {
                const hashedPassword = await bcrypt.hash(password, 10);
                // convert hashed password from string to binary
                await db.query(`
                INSERT INTO users (username, email, age, hashed_password)
                VALUES ('${username}', '${email}', ${age}, '${hashedPassword}')`);
                res.status(200).send(`The user ${username} is created`);
            }
            else {
                res.status(400).send(`Password has to be 8 chars or higher`);
            }
        }
        else {
            res.status(400).send(`Recheck if all required fields were sent`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error creating the user`);
    }
})

usersRouter.post('/login', async (req, res, next) => {
    try {
        if (req.body.email && req.body.password) {
            const { email, password } = req.body;
            const result = await db.query(`SELECT username, hashed_password FROM users WHERE email = '${email}'`);
            const { username, hashed_password } = result.rows[0];
            const validPass = await bcrypt.compare(password, hashed_password);

            if (validPass) {
                await db.query(`
                UPDATE users
                SET logged_in = true
                WHERE email = '${email}'`);
                res.status(200).send(`The user ${username} was logged_in!`);
            }
            else {
                res.status(400).send(`Password is not valid`);
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error logging the user in');
    }
})

module.exports = usersRouter;