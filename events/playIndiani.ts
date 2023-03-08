import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";

export const playIndiani = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useIndiani(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("indiani_active", rooms[roomName].game!.indianiActive);
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}