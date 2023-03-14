const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'discord',
    password: 'postgres',
    port: 5432
});

const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}

const getUsers = async (req, res, next) => {
    try {
        const { rows } = await query(`SELECT id, username, email, age, logged_in FROM users`);
        if (rows.length > 0) {
            res.status(200).send(rows);
        }
        else {
            res.status(404).send(`There are no users`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving users from the database`);
    }
}

const getSingleUser = async (req, res, next) => {
    try {
        const { rows } = await query(
            `
            SELECT *
            FROM users
            WHERE id = ${parseInt(req.params.userId)}`);
        if (rows.length > 0) {
            res.status(200).send(rows[0]);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving the user from database`);
    }
}

const updateSingleUser = async (req, res) => {
    try {
        if (req.query.name && req.query.email && req.query.age) {
            await query(
                `
            UPDATE users
            SET name = '${req.query.name}',
            email = '${req.query.email}',
            age = ${req.query.age}
            WHERE id = ${req.params.userId}`);
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
}

const getChats = async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM chats`);
        res.send(result.rows);
    }
    catch (error) {
        res.status(500).send(`Error retrieving the data from the 'chats' table`);
    }
}

const createChat = async (req, res) => {
    try {
        await query(`
            INSERT INTO chats (user1_id, user2_id)
            VALUES (${req.params.user1_id}, ${req.params.user2_id})`);
        res.status(200).send(`Chat was successfully created`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error creating a new chat`);
    }
}

module.exports = {
    query: query,
    getUsers: getUsers,
    getSingleUser: getSingleUser,
    updateSingleUser: updateSingleUser,
    getChats: getChats,
    createChat: createChat
}