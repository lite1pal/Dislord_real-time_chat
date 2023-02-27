const express = require('express');
const pg = require('pg');
const app = express();
const apiRouter = express.Router();

let users = [{ id: 1, name: 'Nathan', age: 36, email: 'nathan-adventure4@gmail.com', staff: false }, { id: 2, name: 'Sam', age: 41, email: 'sam-charismatic@gmail.com', staff: false }];

app.use('/api', apiRouter);

apiRouter.param('userId', (req, res, next, id) => {
    const user = users.find(user => user.id === parseInt(id));
    if (user) {
        req.user = user;
        next();
    }
    else {
        res.sendStatus(404);
    }
});

apiRouter.get('/users/:userId', (req, res) => {
    res.send(req.user);
})

apiRouter.get('/users', (req, res) => {
    if (users) {
        res.send(users);
    }
    else {
        res.sendStatus(404);
    }
})

apiRouter.put('/users/:userId', (req, res) => {
    console.log(req.query);
    if (req.query.name && req.query.email && req.query.age) {
        users[req.user.id - 1].name = req.query.name;
        users[req.user.id - 1].email = req.query.email;
        users[req.user.id - 1].age = req.query.age;
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
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


const port = 4001;

app.listen(port, () => {
    console.log(`The server is on http://localhost:${port}`);
})