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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.createNewUser = exports.updateUserToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
//third-party modules
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../database/db"));
const TOKEN_KEY = process.env.TOKEN_KEY;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 10);
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashed_password) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidPassword = yield bcrypt_1.default.compare(password, hashed_password);
    return isValidPassword;
});
exports.comparePassword = comparePassword;
const generateToken = (user_id, email, remember) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign({ user_id, email }, TOKEN_KEY, remember ? {} : { expiresIn: 600 });
});
exports.generateToken = generateToken;
const updateUserToken = (token, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)({
        text: "UPDATE users SET token = $1 WHERE id = $2",
        values: [token, user_id],
    });
});
exports.updateUserToken = updateUserToken;
const createNewUser = (username, email, age, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.default)({
        text: `INSERT INTO users (username, email, age, hashed_password, token) 
      VALUES ($1, $2, $3, $4, '1') RETURNING *`,
        values: [username, email, age, hashedPassword],
    });
    return result.rows[0];
});
exports.createNewUser = createNewUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.default)({
        text: `SELECT id, username, hashed_password FROM users WHERE email = $1`,
        values: [email],
    });
    return result.rows[0];
});
exports.getUserByEmail = getUserByEmail;
