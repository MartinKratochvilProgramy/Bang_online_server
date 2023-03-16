import { rooms } from "../server";

export function updateTopStackCard(io: any, roomName: string) {
    // update topStackCard only if is different
    if (rooms[roomName].game === null) return;
    
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game!.getTopStackCard());
}