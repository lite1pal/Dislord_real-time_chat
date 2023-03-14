const express = require('express');
const chatsRouter = express.Router();

const db = require('../db');

chatsRouter.param('user1_id', async (req, res, next, id) => {
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
        res.status(500).send(`Error retrieving the user from database`);
    }
})

chatsRouter.param('user2_id', async (req, res, next, id) => {
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
        res.status(500).send(`Error retrieving the user from database`);
    }
})

chatsRouter.get('/', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM chats`);
        res.send(result.rows);
    }
    catch (error) {
        res.status(500).send(`Error retrieving the data from the 'chats' table`);
    }
})

chatsRouter.post('/:user1_id/:user2_id', async (req, res) => {
    try {
        console.log(req.user1, req.user2);
        const result = await db.query(`
            INSERT INTO chats (chat_id, user1_id, user2_id)
            VALUES (2, 4, 5)`);
        res.status(200).send(`Chat was successfully created`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error creating a new chat`);
    }
})

module.exports = chatsRouter;