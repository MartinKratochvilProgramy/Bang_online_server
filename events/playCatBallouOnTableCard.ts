import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playCatBallouOnTableCard = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game.useCatBallouOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType));
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}