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
exports.saveTypingResult = void 0;
exports.getTopRanking = getTopRanking;
const score_model_1 = require("../models/score.model");
const saveTypingResult = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newResult = new score_model_1.TypingResult(data);
    return yield newResult.save();
});
exports.saveTypingResult = saveTypingResult;
function getTopRanking() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield score_model_1.TypingResult.find().sort({ wpm: -1, accuracy: -1 }).limit(15);
    });
}
