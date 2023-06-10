// import { Pool } from "pg";
// import dotenv from "dotenv";
// dotenv.config();

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

import { Sequelize } from "sequelize";

const POSTGRES_URI = process.env.POSTGRES_URI as string;

const sequelize = new Sequelize(POSTGRES_URI);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize works as intented");
  } catch (error: any) {
    console.error(error.message);
  }
};

export default sequelize;
// export default query;
