import { Server, Socket } from "socket.io";
import { TypingResult } from "../models/score.model";
import mongoose from "mongoose";
import { getTopRanking } from "../services/score.service";

export const checkingTypingSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("sendResult", async (data) => {
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
          userId: new mongoose.Types.ObjectId(),
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

        const ranking = await getTopRanking();

        io.emit("ranking_update", ranking);
        io.emit("saveResult", score);
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    });
  });
};

export const leaderboardSocket = (io: Server) => {
  io.on("connection", async (socket) => {
    const ranking = await getTopRanking();
    socket.emit("ranking_update", ranking);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export default {
  checkingTypingSocket,
  leaderboardSocket,
};
