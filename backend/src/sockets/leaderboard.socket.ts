import { Server } from "socket.io";
import { getTopRanking } from "../services/score.service";

export default function leaderboardSocket(io: Server) {
  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id)

    const ranking = await getTopRanking()
    socket.emit("ranking_update", ranking)

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })
}