import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playBeer = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game.useBeer(data.username, data.cardDigit, data.cardType));
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}