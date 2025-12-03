import { TypingResult } from "../models/score.model";

export const saveTypingResult = async (data: any) => {
  const newResult = new TypingResult(data);
  return await newResult.save();
};
