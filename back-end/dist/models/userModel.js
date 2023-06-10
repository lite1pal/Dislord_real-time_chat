"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../database/db");
const sequelize_1 = require("sequelize");
const User = db_1.sequelize.define("User", {
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    age: { type: sequelize_1.DataTypes.NUMBER, allowNull: false },
    hashed_password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    token: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    logged_in: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    online: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});
const syncModels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.sequelize.sync({ force: false });
        console.log("Models have been synchronized with database");
    }
    catch (error) {
        console.error(error);
    }
});
syncModels();
