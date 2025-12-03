"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingResult = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TypingResultSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    correctChars: { type: Number, required: true },
    incorrectChars: { type: Number, required: true },
    duration: { type: Number, required: true },
    wordList: { type: String, enum: ["simple", "advanced"] },
    punctuation: { type: Boolean, default: false },
    numbers: { type: Boolean, default: false },
    takenAt: { type: Date, default: Date.now },
});
exports.TypingResult = mongoose_1.default.model("TypingResult", TypingResultSchema);
