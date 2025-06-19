import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://slrtech-chatapp.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReciverSocketId = (receverId) => {
  return userSocketmap[receverId];
};

const userSocketmap = {}; //{userId,socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== "undefine") userSocketmap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  // // Handle real-time message sending
  // socket.on("sendMessage", ({ senderId, receiverId, text }) => {
  //   const receiverSocketId = userSocketmap[receiverId];

  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("receiveMessage", {
  //       senderId,
  //       text,
  //       createdAt: new Date(),
  //     });
  //   }
  // });

  socket.on("disconnect", () => {
    delete userSocketmap[userId],
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

export { app, io, server };
