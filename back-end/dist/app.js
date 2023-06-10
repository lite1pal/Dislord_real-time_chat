"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports express.js package into express variable
const express_1 = __importDefault(require("express"));
// creates a new express application
const app = (0, express_1.default)();
// imports the body-parser, cookie-parser and cors modules
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// loads environment variables from .env in process.env object
dotenv_1.default.config();
// imports the routers
const users_1 = __importDefault(require("./routes/users"));
const chats_1 = __importDefault(require("./routes/chats"));
const messages_1 = __importDefault(require("./routes/messages"));
const friends_1 = __importDefault(require("./routes/friends"));
// sets up the middleware functions for the express app
// parses incoming requests in JSON
app.use(express_1.default.json({ limit: "10kb", type: "application/json" }));
// logs detailed info about requests
app.use((0, morgan_1.default)("dev"));
// secures the app by setting various headers to HTTP requests
app.use((0, helmet_1.default)());
// parses cookies attached to incoming requests
app.use((0, cookie_parser_1.default)());
// enables CORS (Cross-Origin Resource Sharing) for requests
// from the specified origin, methods and headers
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
}));
// mounts the users routes at the '/api/users' endpoint
app.use("/api/users", users_1.default);
// mounts the chats routes at the '/api/chats' endpoint
app.use("/api/chats", chats_1.default);
// mounts the messages routes at the '/api/messages' endpoint
app.use("/api/messages", messages_1.default);
// mounts the friends routes at the '/api/friends' endpoint
app.use("/api/friends", friends_1.default);
// exports the express app to use it in server.js
exports.default = app;
