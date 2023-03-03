const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const apiRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/api', apiRouter);

// it retrieves an element from the database using provided id in req.params

apiRouter.param('userId', async (req, res, next, id) => {
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

apiRouter.param('user1_id', async (req, res, next, id) => {
    try {
        const user = await db.query(
            `
            SELECT *
            FROM users
            WHERE ID = ${parseInt(id)}`);
        if (user.rows.length > 0) {
            req.user1 = user.rows[0];
        }
        else {
            res.sendStatus(404);
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(404).send(`Error retrieving the user from database`);
    }
})

apiRouter.param('user2_id', async (req, res, next, id) => {
    try {
        const user = await db.query(
            `
            SELECT *
            FROM users
            WHERE ID = ${parseInt(id)}`);
        if (user.rows.length > 0) {
            req.user2 = user.rows[0];
        }
        else {
            res.sendStatus(404);
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(404).send(`Error retrieving the user from database`);
    }
})

// it handles requests about users

apiRouter.get('/users/:userId', (req, res) => {
    res.send(req.user);
})

apiRouter.get('/users', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.send(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the user from database');
    }
})

apiRouter.put('/users/:userId', async (req, res) => {
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
            res.status(404).send(`There are no all required fields in query`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(`Error updating the user in database`);
    }
})

apiRouter.post('/users/signup', async (req, res) => {
    try {
        if (req.body.name && req.body.email && req.body.age && req.body.password) {
            if (req.body.password.length < 8) {
                res.status(400).send(`Password does not has to be lower than 8 digits`);
            }
            const result = await db.query(`
            INSERT INTO users (name, email, age, password)
            VALUES ('${req.body.name}', '${req.body.email}', ${req.body.age}, '${req.body.password}')`);
            res.status(200).send(`The user '${req.body.name}' is created`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(`Error creating the user`);
    }
})

apiRouter.get('/chats', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM chats`);
        res.send(result.rows);
    }
    catch (error) {
        res.status(404).send(`Error retrieving the data from the 'chats' table`);
    }
})


apiRouter.post('/chats/:user1_id/:user2_id', async (req, res) => {
    try {
        console.log(req.user1, req.user2);
        const result = await db.query(`
            INSERT INTO chats (chat_id, user1_id, user2_id)
            VALUES (2, 4, 5)`);
        res.status(200).send(`Chat was successfully created`);
    }
    catch (error) {
        console.error(error);
        res.status(400).send(`Error creating a new chat`);
    }
})

const port = 4001;

app.listen(port, () => {
    console.log(`The server is on http://localhost:${port}`);
})