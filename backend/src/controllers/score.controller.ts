import { Request, Response } from "express";
import { saveTypingResult } from "../services/score.service";

export const createTypingResult = async (req: Request, res: Response) => {
  try {
    const saved = await saveTypingResult(req.body);
    res.status(201).json({ message: "Saved!", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Error saving Result", error });
  }
};

export default {
  createTypingResult,
};
