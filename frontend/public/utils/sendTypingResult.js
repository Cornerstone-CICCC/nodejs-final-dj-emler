import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import mongoose from "mongoose";
export const socket = io("http://localhost:3500");

export function sendTypingResult(options = {}) {
  const { wordList = "simple", punctuation = true, numbers = true } = options;

  const activeTimeOption = document.querySelector(".time-option.active");
  const activeTimeText = activeTimeOption ? activeTimeOption.textContent : null;

  const data = {
    userId: new mongoose.Types.ObjectId(),
    username: "dbtest1",
    wpm: document.querySelector(".wpm-area").textContent.replace(" WPM", ""),
    accuracy: Number(
      document.querySelector(".accuracy").textContent.replace("%", "")
    ),
    correctChars: document.querySelector(".CorCha").textContent,
    incorrectChars: document.querySelector(".inCorCha").textContent,
    duration: parseDuration(activeTimeText),
    wordList: wordList,
    punctuation: punctuation,
    numbers: numbers,
    takenAt: new Date().toISOString(),
  };

  socket.emit("sendResult", data);
}

function parseDuration(str) {
  const [min, sec] = str.split(":").map(Number);
  return min * 60 + sec;
}
