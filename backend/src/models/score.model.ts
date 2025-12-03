import mongoose from "mongoose";

const TypingResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  username: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  correctChars: { type: Number, required: true },
  incorrectChars: { type: Number, required: true },
  duration: { type: Number, required: true },
  wordList: { type: String, enum: ["simple", "advanced"] },
  punctuation: { type: Boolean, default: false },
  numbers: { type: Boolean, default: false },
  takenAt: { type: Date, default: Date.now },
});

export const TypingResult = mongoose.model("TypingResult", TypingResultSchema);
