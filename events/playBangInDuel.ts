import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playBangInDuel = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game.useBangInDuel(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}