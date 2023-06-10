"use strict";
// import { Pool } from "pg";
// import dotenv from "dotenv";
// dotenv.config();
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
exports.sequelize = void 0;
// // Creates the connection between the Postgres database and the NodeJS server.
// const pool = new Pool({
//   user: process.env.POSTGRES_USER,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DB,
//   password: process.env.POSTGRES_PASSWORD,
//   port: process.env.POSTGRES_PORT,
//   ssl: { rejectUnauthorized: false },
// });
// // Returns the query's response
// const query = async (text, params) => {
//   const start = Date.now();
//   const res = await pool.query(text, params);
//   const duration = Date.now() - start;
//   console.log("executed query", { text, duration, rows: res.rowCount });
//   return res;
// };
const sequelize_1 = require("sequelize");
const POSTGRES_URI = process.env.POSTGRES_URI;
const sequelize = new sequelize_1.Sequelize(POSTGRES_URI);
exports.sequelize = sequelize;
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Sequelize works as intented");
    }
    catch (error) {
        console.error(error.message);
    }
});
// export default query;
