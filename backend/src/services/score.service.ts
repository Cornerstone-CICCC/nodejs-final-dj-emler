import Score, { TypingResult } from "../models/score.model";

export const saveTypingResult = async (data: any) => {
  const newResult = new TypingResult(data);
  return await newResult.save();
};
//import Score from "../models/score.model";

export async function getTopRanking() {
  return await Score.find()
    .sort({ wpm: -1 })
    .limit(15)
    .populate("userId", "username");
}

export async function addScore(data: {
  userId: string;
  wpm: number;
  accuracy: number;
  time?: number;
  taken?: string;
}) {
  return await Score.create(data);
}
