// imports express.js package into express variable
const express = require("express");

// creates a new express application
const app = express();

// imports the body-parser, cookie-parser and cors modules
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

// loads environment variables from .env in process.env object
require("dotenv").config();

// imports the routers
const usersRouter = require("./routes/users");
const chatsRouter = require("./routes/chats");
const messagesRouter = require("./routes/messages");

// sets up the middleware functions for the express app

// parses incoming request bodies as JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// logs detailed info about requests
app.use(morgan("dev"));

// secures the app by setting various headers to HTTP requests
app.use(helmet());

// parses cookies attached to incoming requests
app.use(cookieParser());

// enables CORS (Cross-Origin Resource Sharing) for requests
// from the specified origin, methods and headers
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}:3000`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
  })
);

// mounts the users routes at the '/api/users' endpoint
app.use("/api/users", usersRouter);

// mounts the chats routes at the '/api/chats' endpoint
app.use("/api/chats", chatsRouter);

// mounts the messages routes at the '/api/messages' endpoint
app.use("/api/messages", messagesRouter);

// exports the express app to use it in server.js
module.exports = app;
