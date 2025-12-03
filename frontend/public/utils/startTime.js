import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { sendTypingResult } from "./sendTypingResult.js";
const socket = io("http://localhost:3500");

export function startTime(seconds, typingData) {
  let timeLeft = seconds;
  const countdownDisplay = document.querySelector(".time-area");
  const typingblock = document.getElementById("typing-input");

  const timer = setInterval(() => {
    countdownDisplay.textContent =
      timeLeft < 10 ? `0:0${timeLeft}` : `0:${timeLeft}`;

    console.log("timeLeft", timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      countdownDisplay.textContent = `0:0${timeLeft}`;
      typingblock.disabled = true;

      socket.emit("sendResult", typingData);
      sendTypingResult(typingData);
      showSnackbar("Your time is over.", "success");
    }
    timeLeft--;
  }, 1000);
}

function showSnackbar(message, type) {
  if (!snackbar) return;

  snackbar.textContent = message;

  snackbar.className = "";
  snackbar.classList.add(type);
  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000);
}
