"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports http module
const http_1 = __importDefault(require("http"));
// imports the express app from ./app.js
const app_1 = __importDefault(require("./app"));
// creates the server
const server = http_1.default.createServer(app_1.default);
// imports socket.io module
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// configures the socket.io with specified cors options
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
// listens for socket connections and handles events
io.on("connection", (socket) => {
    console.log(`User connected`);
    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });
    socket.on("remove chat", (data) => {
        io.emit("remove chat", data);
    });
    socket.on("create chat", (data) => {
        io.emit("create chat", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
// sets the server to listen to a specified port
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
server.listen(port, () => {
    console.log(`The server is on ${process.env.SERVER_URL}:${port}`);
});
