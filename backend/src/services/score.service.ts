import Score, { TypingResult } from "../models/score.model";

export const saveTypingResult = async (data: any) => {
  const newResult = new TypingResult(data);
  return await newResult.save();
};

export async function getTopRanking() {
  return await TypingResult.find().sort({ wpm: -1, accuracy: -1 }).limit(15);
}
