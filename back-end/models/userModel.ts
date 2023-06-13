import { sequelize } from "../database/db";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  age: { type: DataTypes.INTEGER, allowNull: false },
  hashed_password: { type: DataTypes.STRING, allowNull: false },
  avatar_url: { type: DataTypes.STRING, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false },
  logged_in: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  online: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});
