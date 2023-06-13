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
exports.deleteUser = exports.authGoogle = exports.loginUser = exports.createUser = exports.updateUserById = exports.getUserById = exports.getUsers = void 0;
// third-party modules
const express_validator_1 = require("express-validator");
// models
const userModel_1 = require("../models/userModel");
// my functions to make a code more readable
const utils_1 = require("../helpers/utils");
const google_1 = require("../services/google");
// retrieves users from the database
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* try/catch helps to see what errors occured during async functions
       and fix them quickly as you know what a problem is */
    try {
        const users = yield userModel_1.User.findAll({
            attributes: ["id", "username", "email", "age", "logged_in", "avatar_url"],
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
        return res.status(200).json({
            token: token,
            user: { id: id, username: username, email: email },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error logging the user in");
    }
});
exports.loginUser = loginUser;
const authGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenGoogle } = req.body;
        if (!tokenGoogle)
            return res.status(400).json("Google token is missing");
        const user = yield (0, google_1.verifyJWT)(process.env.GOOGLE_CLIENT_ID, tokenGoogle);
        if (!user)
            return res.status(401).json("Token was not verified by Google");
        const existingUser = yield userModel_1.User.findOne({ where: { email: user.email } });
        let token;
        if (!existingUser) {
            const newUser = yield userModel_1.User.create({
                username: user.name,
                email: user.email,
                age: 0,
                hashed_password: user.sub,
                avatar_url: user.picture,
                token: "1",
            });
            const { id, username, email } = newUser.dataValues;
            token = yield (0, utils_1.generateToken)(id, email);
            yield userModel_1.User.update({ token }, { where: { email } });
            return res.status(200).json({
                token,
                user: {
                    id,
                    username,
                    email,
                },
                user_avatar: user.picture,
                message: "User was authenticated via Google",
            });
        }
        else {
            token = yield (0, utils_1.generateToken)(1, "some@gmail.com");
            yield userModel_1.User.update({ token }, { where: { email: user.email } });
            return res.status(200).json({
                token,
                user: existingUser,
                user_avatar: user.picture,
                message: "User was authenticated via Google",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error signing user in via Google");
    }
});
exports.authGoogle = authGoogle;
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
