const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "https://main--stirring-babka-9fc376.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected`);
  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

server.listen(port, () => {
  console.log(`The server is on http://localhost:${port}`);
});
