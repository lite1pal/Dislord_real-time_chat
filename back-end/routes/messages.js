const express = require('express');
const db = require('../db');
const messagesRouter = express.Router();

messagesRouter.get('/:chatId', async (req, res, next) => {
    try {
        const chatMessages = await db.query(`
        SELECT *
        FROM messages
        WHERE chat_id = ${req.params.chatId}
        `);
        res.status(200).send(chatMessages.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving messages from the chat`);
    }
})

messagesRouter.post('/:chatId/:userId', async (req, res, next) => {
    try {
        if (req.body.message) {
            const message = req.body.message;
            await db.query(`
            INSERT INTO messages (user_id, chat_id, message)
            VALUES (${req.params.userId}, ${req.params.chatId}, '${message}')
            `);
            res.status(200).send(`The message was sent!`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error sending the message`);
    }
})

module.exports = messagesRouter;