const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const apiRouter = express.Router();

let users = [{ id: 1, name: 'Nathan', age: 36, email: 'nathan-adventure4@gmail.com', staff: false }, { id: 2, name: 'Sam', age: 41, email: 'sam-charismatic@gmail.com', staff: false }];

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/api', apiRouter);

apiRouter.param('userId', async (req, res, next, id) => {
    try {
        const user = await db.query(
            `
            SELECT *
            FROM users
            WHERE id = ${parseInt(id)}`);
        if (user.rows.length > 0) {
            req.user = user.rows;
            next();
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (error) {
        res.status(500).send(`Error retrieving users from database`);
    }
})

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
            console.log(req.query.name, req.query.email, req.query.age);
            const result = await db.query(
                `
            UPDATE users
            SET name = ${req.query.name},
            email = ${req.query.email},
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

apiRouter.post('/users', (req, res) => {
    if (req.query.name && req.query.email && req.query.age) {
        const newUser = {
            id: users.length + 1,
            name: req.query.name,
            email: req.query.email,
            age: req.query.age,
            staff: false
        };
        users.push(newUser);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
})

apiRouter.post('/users/signup', async (req, res) => {
    console.log(req.body);
    try {
        if (req.body.name && req.body.email && req.body.age && req.body.password) {
            if (req.body.password.length < 8) {
                res.status(400).send(`Password does not has to be lower than 8 digits`);
            }
            const result = await db.query(`
            INSERT INTO users (name, email, age, password)
            VALUES (${req.body.name}, ${req.body.email}, ${req.body.age}, ${req.body.password})`);
            res.status(200).send(`The user '${req.body.name}' is created`);
        }
    }
    catch (error) {
        // console.error(error);
        res.status(400).send(`Error creating the user`);
    }
})


const port = 4001;

app.listen(port, () => {
    console.log(`The server is on http://localhost:${port}`);
})