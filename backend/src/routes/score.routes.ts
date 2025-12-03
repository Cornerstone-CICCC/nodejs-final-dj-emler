import { Router } from "express";
import { getRanking, saveScore } from "../controllers/score.controller";

const router = Router();

router.get("/rank", getRanking);
router.post("/", saveScore);

export default router;
