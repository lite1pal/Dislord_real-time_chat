"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const db_1 = require("../database/db");
const sequelize_1 = require("sequelize");
const userModel_1 = require("./userModel");
exports.Chat = db_1.sequelize.define("Chat", {
    chat_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    user1_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
    user1_avatar_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    user2_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
    user2_avatar_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.Chat.belongsTo(userModel_1.User, { foreignKey: "user1_id" });
exports.Chat.belongsTo(userModel_1.User, { foreignKey: "user2_id" });
