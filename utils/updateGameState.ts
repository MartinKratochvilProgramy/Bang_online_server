import { rooms } from "../server";
import { compareCards } from "./compareCards";

export const updateGameState = (io: any, roomName: any) => {
    try {
        io.to(roomName).emit("update_hands");

        // update topStackCard only if is different
        const prevTopStackCard = rooms[roomName].game.prevTopStackCard;
        const topStackCard = rooms[roomName].game.getTopStackCard();
        if (!compareCards(topStackCard, prevTopStackCard)) {
            rooms[roomName].game.prevTopStackCard = topStackCard
            io.to(roomName).emit("update_top_stack_card", topStackCard);
        }

        io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
    } catch (error) {
        console.log(`Error on updateGameState():`);
        console.log(error);
    }
}