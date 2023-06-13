"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friend = void 0;
const db_1 = require("../database/db");
const sequelize_1 = require("sequelize");
const userModel_1 = require("./userModel");
exports.Friend = db_1.sequelize.define("Friend", {
    status: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    user1_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
    user2_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
});
exports.Friend.belongsTo(userModel_1.User, { foreignKey: "user1_id" });
exports.Friend.belongsTo(userModel_1.User, { foreignKey: "user2_id" });
