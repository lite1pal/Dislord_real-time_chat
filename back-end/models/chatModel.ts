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
  user1_avatar_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  user2_avatar_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Chat.belongsTo(User, { foreignKey: "user1_id" });
Chat.belongsTo(User, { foreignKey: "user2_id" });
