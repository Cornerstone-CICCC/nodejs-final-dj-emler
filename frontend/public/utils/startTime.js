import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { sendTypingResult } from "./sendTypingResult.js";
const socket = io("http://localhost:3500");

let timer;

export function startTime(seconds) {
  let timeLeft = seconds;
  const countdownDisplay = document.querySelector(".time-area");
  const typingblock = document.getElementById("typing-input");

  timer = setInterval(() => {
    countdownDisplay.textContent =
      timeLeft < 10 ? `0:0${timeLeft}` : `0:${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      countdownDisplay.textContent = `0:00`;
      typingblock.disabled = true;

      showSnackbar("Your time is over.", "success");
    }
    timeLeft--;
  }, 1000);
}

export function stopTimer() {
  if (timer) {
    clearInterval(timer);
  }
}

export function showSnackbar(message, type) {
  if (!snackbar) return;

  snackbar.textContent = message;

  snackbar.className = "";
  snackbar.classList.add(type);
  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000);
}
