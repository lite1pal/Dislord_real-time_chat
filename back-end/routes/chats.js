const express = require('express');
const chatsRouter = express.Router();

const { getChats, createChat } = require('../database/db');
const { auth } = require('../utils');

chatsRouter.get('/', auth, getChats);

chatsRouter.post('/:user1_id/:user2_id', auth, createChat);

module.exports = chatsRouter;