"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputLoginUser = exports.validateInputCreateUser = exports.auth = void 0;
// third-party modules
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const TOKEN_KEY = process.env.TOKEN_KEY;
const auth = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(400).json("There is no token");
        const isToken = jsonwebtoken_1.default.verify(token, TOKEN_KEY);
        if (!isToken) {
            return res.status(400).json(`Invalid token or no token at all`);
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.clearCookie("token");
        return res.status(400).json(`Log in to go on`);
    }
};
exports.auth = auth;
exports.validateInputCreateUser = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required."),
    (0, express_validator_1.body)("age")
        .notEmpty()
        .withMessage("Age is required.")
        .isNumeric()
        .withMessage("Invalid type"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must to be at least 8 characters"),
];
exports.validateInputLoginUser = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must to be at least 8 characters"),
    (0, express_validator_1.body)("remember")
        .isBoolean()
        .withMessage("Remember has to be a boolean value"),
];
