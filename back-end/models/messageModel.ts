import { sequelize } from "../database/db";
import { DataTypes } from "sequelize";

import { Chat } from "./chatModel";
import { User } from "./userModel";

export const Message = sequelize.define("Message", {
  message: { type: DataTypes.STRING, allowNull: false },
  chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chat,
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  user_name: { type: DataTypes.STRING, allowNull: false },
  avatar_url: { type: DataTypes.STRING, allowNull: false },
});

Message.belongsTo(Chat, { foreignKey: "chat_id" });
Message.belongsTo(User, { foreignKey: "user_id" });

// const syncModels = async () => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log("Models have been synchronized with database");
//   } catch (error) {
//     console.error(error);
//   }
// };

// syncModels();
