import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playPrigione = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game.playPrigione(data.target, data.activeCard));
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}