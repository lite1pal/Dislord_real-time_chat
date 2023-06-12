"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.loginUser = exports.createUser = exports.updateUserById = exports.getUserById = exports.getUsers = void 0;
// third-party modules
const express_validator_1 = require("express-validator");
// requires query func to write queries for database
const db_1 = require("../database/db");
// models
const userModel_1 = require("../models/userModel");
// my functions to make a code more readable
const utils_1 = require("../helpers/utils");
// retrieves users from the database
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* try/catch helps to see what errors occured during async functions
       and fix them quickly as you know what a problem is */
    try {
        const users = yield userModel_1.User.findAll({
            attributes: ["id", "username", "email", "age", "logged_in"],
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving users from the database`);
    }
});
exports.getUsers = getUsers;
// Retrieves a single user from the Postgres database based on the provided id
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // extracts userId from req.params using destructuring assignment
        const { userId } = req.params;
        // retrieves the user from the database with specific id
        const user = yield userModel_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json("There is no user with such id");
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(`Error retrieving the user from database`);
    }
});
exports.getUserById = getUserById;
// Updates a single user in the Postgres database based on the provided id
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, age, userId } = req.params;
        if (!name || !email || !age) {
            return res.status(400).json(`There are no all required fields in query`);
        }
        yield db_1.pool.query({
            text: `UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4`,
            values: [name, email, age, userId],
        });
        return res.status(200).json();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(`Error updating the user in database`);
    }
});
exports.updateUserById = updateUserById;
// creates a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, age, password } = req.body;
        // handles errors of the express-validator's middleware
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        // hashes the password
        const hashedPassword = yield (0, utils_1.hashPassword)(password);
        const newUser = yield userModel_1.User.create({
            username,
            email,
            age,
            hashed_password: hashedPassword,
            token: "1",
        });
        return res.status(200).json({ newUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(`Error creating the user`);
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, remember } = req.body;
        // const { id, username, hashed_password } = await getUserByEmail(email);
        const existingUser = yield userModel_1.User.findOne({
            where: { email },
        });
        if (!existingUser) {
            return res.status(400).json("There is no user with such email");
        }
        const { id, username, hashed_password } = existingUser.dataValues;
        if (!id || !username || !hashed_password) {
            return res.status(404).json(`Some of the select data is empty`);
        }
        // compares the provided password with the database password
        const isValidPassword = yield (0, utils_1.comparePassword)(password, hashed_password);
        if (!isValidPassword) {
            return res.status(400).json(`Invalid password`);
        }
        // generates a new token
        const token = yield (0, utils_1.generateToken)(id, email, remember);
        // updates the user's token in the database
        // await updateUserToken(token, id);
        yield userModel_1.User.update({ token }, { where: { email } });
        res.status(200).json({
            token: token,
            user: { id: id, username: username, email: email },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error logging the user in");
    }
});
exports.loginUser = loginUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (!user_id)
            return res.status(400).json("There is no user_id provided in req.params");
        const deletedUser = yield userModel_1.User.destroy({ where: { id: user_id } });
        if (deletedUser === 0)
            return res.status(404).json("There is no user with such id");
        return res.status(200).json("User was deleted");
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error deleting a user");
    }
});
exports.deleteUser = deleteUser;
