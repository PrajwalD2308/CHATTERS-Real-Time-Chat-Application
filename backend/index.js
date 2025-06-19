import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./rout/authUser.js";
import messageRouter from "./rout/messageRout.js";
import userRouter from "./rout/userRout.js";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
import { app, server } from "./Socket/socket.js";

const __dirname = path.resolve();

dotenv.config();

// const app = express();
// const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//  Routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("hi server is working");
});

//  Start the server
server.listen(PORT, () => {
  dbConnect();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
