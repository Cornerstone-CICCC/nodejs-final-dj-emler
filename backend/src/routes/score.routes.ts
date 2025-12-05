import { Router } from "express";
import {
  createTypingResult,
  getRanking,
  saveScore,
} from "../controllers/score.controller";

const scoreRouter = Router();

scoreRouter.post("/result", createTypingResult);
scoreRouter.get("/rank", getRanking);
scoreRouter.post("/", saveScore);

//const router = Router();

export default scoreRouter;
