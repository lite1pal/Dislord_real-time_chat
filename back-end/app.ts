// imports express.js package into express variable
import express from "express";

// creates a new express application
const app = express();

// imports the body-parser, cookie-parser and cors modules
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// loads environment variables from .env in process.env object
dotenv.config();

// imports the routers
import usersRouter from "./routes/users";
import chatsRouter from "./routes/chats";
import messagesRouter from "./routes/messages";
import friendsRouter from "./routes/friends";

// sets up the middleware functions for the express app

// parses incoming requests in JSON
app.use(express.json({ limit: "10kb", type: "application/json" }));

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
    origin: process.env.CLIENT_URL,
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

// mounts the friends routes at the '/api/friends' endpoint
app.use("/api/friends", friendsRouter);

// exports the express app to use it in server.js
export default app;
