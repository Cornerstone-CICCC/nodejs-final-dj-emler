import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import scoreRoutes from "./routes/score.routes";
//import leaderboardSocket from "./sockets/leaderboard.socket";
dotenv.config();
import userRouter from "./routes/user.routes";
import {
  checkingTypingSocket,
  leaderboardSocket,
} from "./sockets/leaderboard.socket";
import scoreRouter from "./routes/score.routes";

// Create server
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:4321",
    credentials: true,
  })
);
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
  throw new Error("Missing cookie keys!");
}

app.use(express.json());
app.use("/score", scoreRoutes);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_PRIMARY_KEY, process.env.COOKIE_SECONDARY_KEY],
    maxAge: 3 * 30 * 24 * 60 * 60 * 1000, // 3 months
  })
);

// Routes write your router
//app.use("/", chatRouter);
app.use("/users", userRouter);
app.use("/", scoreRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is running!");
});

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4321", // Your frontend url here (Astro, React, vanilla HTML)
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URI!;
mongoose
  //.connect(MONGO_URI, { dbName: "typing_test" })
  .connect(MONGO_URI, { dbName: "finalproject" })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Start Socket.IO
    //chatSocket(io);
    checkingTypingSocket(io);
    leaderboardSocket(io);

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
