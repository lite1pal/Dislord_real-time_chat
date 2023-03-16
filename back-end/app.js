const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');
const messagesRouter = require('./routes/messages');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);

app.use('/api/chats', chatsRouter);

app.use('/api/messages', messagesRouter);

module.exports = app;