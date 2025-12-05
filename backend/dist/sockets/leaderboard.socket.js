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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardSocket = exports.checkingTypingSocket = void 0;
const score_model_1 = require("../models/score.model");
const mongoose_1 = __importDefault(require("mongoose"));
const score_service_1 = require("../services/score.service");
const checkingTypingSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(socket.id);
        socket.on("sendResult", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("data", data);
            if (!data) {
                console.warn("sendResult received null or undefined data");
                return;
            }
            const { userId = new mongoose_1.default.Types.ObjectId(), username = "guest", wpm = 0, accuracy = 0, correctChars = 0, incorrectChars = 0, duration = 0, wordList = "simple", punctuation = true, numbers = true, takenAt = new Date().toISOString(), } = data;
            if (username == null ||
                wpm == null ||
                accuracy == null ||
                correctChars == null ||
                incorrectChars == null ||
                duration == null ||
                wordList == null ||
                punctuation == null ||
                numbers == null ||
                takenAt == null)
                return;
            try {
                const score = new score_model_1.TypingResult({
                    //userId: data.userId,
                    userId: new mongoose_1.default.Types.ObjectId(),
                    username: username,
                    wpm,
                    accuracy,
                    correctChars,
                    incorrectChars,
                    duration,
                    wordList,
                    punctuation,
                    numbers,
                    takenAt,
                });
                yield score.save();
                const ranking = yield (0, score_service_1.getTopRanking)();
                io.emit("ranking_update", ranking);
                io.emit("saveResult", score);
            }
            catch (error) {
                console.error("Error saving chat:", error);
            }
        }));
    });
};
exports.checkingTypingSocket = checkingTypingSocket;
const leaderboardSocket = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Client connected:", socket.id);
        const ranking = yield (0, score_service_1.getTopRanking)();
        socket.emit("ranking_update", ranking);
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    }));
};
exports.leaderboardSocket = leaderboardSocket;
exports.default = {
    checkingTypingSocket: exports.checkingTypingSocket,
    leaderboardSocket: exports.leaderboardSocket,
};
