import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";

export const playMancatoOnIndiani = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useMancatoOnIndiani(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        io.to(roomName).emit("indiani_active", rooms[roomName].game!.indianiActive);
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}