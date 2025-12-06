"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const score_controller_1 = require("../controllers/score.controller");
const scoreRouter = (0, express_1.Router)();
scoreRouter.post("/result", score_controller_1.createTypingResult);
scoreRouter.get("/rank", score_controller_1.getRanking);
exports.default = scoreRouter;
