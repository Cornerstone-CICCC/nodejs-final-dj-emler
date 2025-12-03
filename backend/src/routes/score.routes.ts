import { Router } from "express";
import { createTypingResult } from "../controllers/score.controller";

const scoreRouter = Router();

scoreRouter.post("/result", createTypingResult);

export default scoreRouter;
