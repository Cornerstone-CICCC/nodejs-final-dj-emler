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
exports.default = leaderboardSocket;
const score_service_1 = require("../services/score.service");
function leaderboardSocket(io) {
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log("Client connected:", socket.id);
        const ranking = yield (0, score_service_1.getTopRanking)();
        socket.emit("ranking_update", ranking);
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    }));
}
