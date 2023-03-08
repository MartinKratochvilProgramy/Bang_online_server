import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";

export const playBeer = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBeer(data.username, data.cardDigit, data.cardType));
        updateGameState(io, roomName);
        io.to(roomName).emit("update_health", {
            username: data.username,
            health: rooms[roomName].game!.players[data.username].character.health
        });
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}