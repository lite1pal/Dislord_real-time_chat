// plain postgresql

import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Creates the connection between the Postgres database and the NodeJS server.
export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

// Returns the query's response
export const query = async (text: any, params: any = {}) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

// sequelize

import { Sequelize } from "sequelize";

const POSTGRES_URI = process.env.POSTGRES_URI as string;
const POSTGRES_DB = process.env.POSTGRES_DB as string;
const POSTGRES_USER = process.env.POSTGRES_USER as string;

// export const sequelize = new Sequelize(POSTGRES_URI);
export const sequelize = new Sequelize(
  POSTGRES_DB,
  POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Ignore self-signed certificates or certificate validation issues
      },
    },
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize works as intented");
  } catch (error: any) {
    console.error(error.message);
  }
};
