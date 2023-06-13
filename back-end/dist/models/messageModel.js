"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const db_1 = require("../database/db");
const sequelize_1 = require("sequelize");
const chatModel_1 = require("./chatModel");
const userModel_1 = require("./userModel");
exports.Message = db_1.sequelize.define("Message", {
    message: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    chat_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: chatModel_1.Chat,
            key: "id",
        },
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
    user_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    avatar_url: { type: sequelize_1.DataTypes.STRING, allowNull: false },
});
exports.Message.belongsTo(chatModel_1.Chat, { foreignKey: "chat_id" });
exports.Message.belongsTo(userModel_1.User, { foreignKey: "user_id" });
// const syncModels = async () => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log("Models have been synchronized with database");
//   } catch (error) {
//     console.error(error);
//   }
// };
// syncModels();
