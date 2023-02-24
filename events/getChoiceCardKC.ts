import { updateGameState } from "../utils";
import { rooms } from "../server";
import { updatePlayerHands } from "../utils/updatePlayerHands";

export const getChoiceCardKC = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        rooms[roomName].game.getChoiceCardKC(data.username, data.card);
        updateGameState(io, roomName);
        io.to(roomName).emit("update_draw_choices", "Kit Carlson");
        updatePlayerHands(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}