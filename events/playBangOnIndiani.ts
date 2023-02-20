import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playBangOnIndiani = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game.useBangOnIndiani(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
        io.to(roomName).emit("indiani_active", rooms[roomName].game.indianiActive);
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}