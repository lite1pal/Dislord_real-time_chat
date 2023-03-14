const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');
const messagesRouter = require('./routes/messages');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', usersRouter);

app.use('/api/chats', chatsRouter);

app.use('/api/messages', messagesRouter);

const port = 4001;

app.listen(port, () => {
    console.log(`The server is on http://localhost:${port}`);
})