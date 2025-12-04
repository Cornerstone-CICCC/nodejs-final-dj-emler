import mongoose, { Schema, Document } from "mongoose";

const TypingResultSchema = new mongoose.Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
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
export interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  wpm: number;
  accuracy: number;
  time?: number;
  taken?: string;
}

const ScoreSchema: Schema = new Schema(
  {
    //userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    time: { type: Number, default: 60 },
    taken: { type: String, default: "" },
  },
  { timestamps: true }
);

const Score = mongoose.model<IScore>("Score", ScoreSchema);
export default Score;
