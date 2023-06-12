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
    user2_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.User,
            key: "id",
        },
    },
});
exports.Chat.belongsTo(userModel_1.User, { foreignKey: "user1_id", as: "user1" });
exports.Chat.belongsTo(userModel_1.User, { foreignKey: "user2_id", as: "user2" });
// const syncModels = async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log("Models have been synchronized with database");
//   } catch (error) {
//     console.error(error);
//   }
// };
// syncModels();
