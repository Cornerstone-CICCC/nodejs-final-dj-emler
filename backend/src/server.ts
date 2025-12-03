import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import checkingTypingSocket from "./sockets/leaderboard.socket";
import scoreRouter from "./routes/score.routes";

// Create server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes write your router
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
  },
});

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URI!;
mongoose
  .connect(MONGO_URI, { dbName: "finalproject" })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Start Socket.IO
    //chatSocket(io);
    checkingTypingSocket(io);

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
