import { sequelize } from "../database/db";
import { DataTypes } from "sequelize";

import { User } from "./userModel";

export const Chat = sequelize.define("Chat", {
  chat_name: { type: DataTypes.STRING, allowNull: false },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Chat.belongsTo(User, { foreignKey: "user1_id", as: "user1" });
Chat.belongsTo(User, { foreignKey: "user2_id", as: "user2" });

// const syncModels = async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log("Models have been synchronized with database");
//   } catch (error) {
//     console.error(error);
//   }
// };

// syncModels();
