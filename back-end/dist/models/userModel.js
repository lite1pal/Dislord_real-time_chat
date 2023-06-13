"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_1 = require("../database/db");
const sequelize_1 = require("sequelize");
exports.User = db_1.sequelize.define("User", {
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    age: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    hashed_password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    avatar_url: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    token: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    logged_in: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    online: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});
