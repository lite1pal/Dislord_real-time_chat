const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const chat_bot = "ChatBot";
let chatRoom = "";
let allUsers = [];
let chatRoomUsers = [];

io.on("connection", (socket) => {
  console.log(`User connected`);
  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  //   socket.on("join_room", (data) => {
  //     const { username, room } = data;
  //     socket.join(room);

  //     let __createdtime__ = Date.now();

  //     socket.to(room).emit("receive_message", {
  //       message: `${username} has joined the chat room`,
  //       username: chat_bot,
  //       __createdtime__,
  //     });

  //     socket.emit("receive_message", {
  //       message: `Welcome ${username}`,
  //       username: chat_bot,
  //       __createdtime__,
  //     });

  //     chatRoom = room;
  //     allUsers.push({ id: socket.id, username, room });
  //     chatRoomUsers = allUsers.filter((user) => user.room === room);
  //     socket.to(room).emit("chatroom_users", chatRoomUsers);
  //     socket.emit("chatroom_users", chatRoomUsers);
  //   });
});

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

server.listen(port, () => {
  console.log(`The server is on http://localhost:${port}`);
});
