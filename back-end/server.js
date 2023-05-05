// imports http module
const http = require("http");

// imports the express app from ./app.js
const app = require("./app");

// creates the server
const server = http.createServer(app);

// imports socket.io module
const { Server } = require("socket.io");
require("dotenv").config();

// configures the socket.io with specified cors options
const io = new Server(server, {
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
