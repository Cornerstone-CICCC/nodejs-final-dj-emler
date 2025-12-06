import { Request, Response } from "express";
import { saveTypingResult } from "../services/score.service";
import { getTopRanking } from "../services/score.service";

export const createTypingResult = async (req: Request, res: Response) => {
  try {
    const saved = await saveTypingResult(req.body);
    res.status(201).json({ message: "Saved!", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Error saving Result", error });
  }
};

export async function getRanking(req: Request, res: Response) {
  try {
    const ranking = await getTopRanking();
    return res.status(200).json(ranking);
  } catch (error: any) {
    console.error("getRanking error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch ranking", error: error.message });
  }
}

export default {
  createTypingResult,
};
