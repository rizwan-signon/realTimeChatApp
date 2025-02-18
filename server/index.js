const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React Frontend URL
    methods: ["GET", "POST"],
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins the chat
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("userList", Object.values(users));
    io.emit("message", {
      user: "System",
      text: `${username} joined the chat.`,
    });
  });

  // Sending messages
  socket.on("sendMessage", (message) => {
    io.emit("message", { user: users[socket.id], text: message });
  });

  // Typing indicator
  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("typing", { user: users[socket.id], isTyping });
  });

  // User disconnects
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("message", {
        user: "System",
        text: `${users[socket.id]} left the chat.`,
      });
      delete users[socket.id];
      io.emit("userList", Object.values(users));
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
