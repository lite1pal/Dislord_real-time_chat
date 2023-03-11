const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const usersRouter = require('./users');
const chatsRouter = require('./chats');
const messagesRouter = require('./messages');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// it handles requests about users

app.use('/api/users', usersRouter);

app.use('/api/chats', chatsRouter);

app.use('/api/messages', messagesRouter);

const port = 4001;

app.listen(port, () => {
    console.log(`The server is on http://localhost:${port}`);
})