// sequelize

import { Sequelize } from "sequelize";

const POSTGRES_DB = process.env.POSTGRES_DB as string;
const POSTGRES_USER = process.env.POSTGRES_USER as string;

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
        rejectUnauthorized: false,
      },
    },
  }
);
