import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";

export const placeBlueCardOnTable = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.placeBlueCardOnTable(data.card));
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}