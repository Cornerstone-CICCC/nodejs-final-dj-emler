"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypingResult = void 0;
exports.getRanking = getRanking;
const score_service_1 = require("../services/score.service");
const score_service_2 = require("../services/score.service");
const createTypingResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saved = yield (0, score_service_1.saveTypingResult)(req.body);
        res.status(201).json({ message: "Saved!", data: saved });
    }
    catch (error) {
        res.status(500).json({ message: "Error saving Result", error });
    }
});
exports.createTypingResult = createTypingResult;
function getRanking(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ranking = yield (0, score_service_2.getTopRanking)();
            console.log("ranking", ranking);
            return res.status(200).json(ranking);
        }
        catch (error) {
            console.error("getRanking error:", error);
            return res
                .status(500)
                .json({ message: "Failed to fetch ranking", error: error.message });
        }
    });
}
exports.default = {
    createTypingResult: exports.createTypingResult,
};
