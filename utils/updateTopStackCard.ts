import { rooms } from "../server";
import { compareCards } from "./compareCards";

export function updateTopStackCard(io: any, roomName: string) {
    // update topStackCard only if is different
    if (rooms[roomName].game === null) return;
    
    const prevTopStackCard = rooms[roomName].game!.prevTopStackCard;
    const topStackCard = rooms[roomName].game!.getTopStackCard();
    if (!compareCards(topStackCard, prevTopStackCard)) {
        rooms[roomName].game!.prevTopStackCard = topStackCard
        io.to(roomName).emit("update_top_stack_card", topStackCard);
    }
}