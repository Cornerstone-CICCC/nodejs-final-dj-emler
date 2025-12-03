import { Server, Socket } from "socket.io";
import { TypingResult } from "../models/score.model";
import { createTypingResult } from "../controllers/score.controller";
import mongoose from "mongoose";

const checkingTypingSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(socket.id);
    socket.on("sendResult", async (data) => {
      //const text = data;
      console.log("data", data);
      if (!data) {
        console.warn("sendResult received null or undefined data");
        return;
      }

      const {
        userId = new mongoose.Types.ObjectId(),
        username = "guest",
        wpm = 0,
        accuracy = 0,
        correctChars = 0,
        incorrectChars = 0,
        duration = 0,
        wordList = "simple",
        punctuation = true,
        numbers = true,
        takenAt = new Date().toISOString(),
      } = data;

      if (
        username == null ||
        wpm == null ||
        accuracy == null ||
        correctChars == null ||
        incorrectChars == null ||
        duration == null ||
        wordList == null ||
        punctuation == null ||
        numbers == null ||
        takenAt == null
      )
        return;
      try {
        const score = new TypingResult({
          //userId: data.userId,
          userId,
          username: username,
          wpm,
          accuracy,
          correctChars,
          incorrectChars,
          duration,
          wordList,
          punctuation,
          numbers,
          takenAt,
        });
        await score.save();
        io.emit("saveResult", score);
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    });
  });
};

export default checkingTypingSocket;
