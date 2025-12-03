import mongoose, { Schema, Document } from "mongoose";

export interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  wpm: number;
  accuracy: number;
  time?: number;
  taken?: string;
}

const ScoreSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    time: { type: Number, default: 60 },
    taken: { type: String, default: "" }
  },
  { timestamps: true }
)

const Score = mongoose.model<IScore>("Score", ScoreSchema)
export default Score