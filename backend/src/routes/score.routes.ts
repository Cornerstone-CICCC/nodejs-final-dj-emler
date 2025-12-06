import { Router } from "express";
import {
  createTypingResult,
  getRanking,
} from "../controllers/score.controller";

const scoreRouter = Router();

scoreRouter.post("/result", createTypingResult);
scoreRouter.get("/rank", getRanking);

export default scoreRouter;
