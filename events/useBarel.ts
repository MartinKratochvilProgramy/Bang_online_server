import { updateGameState } from "../utils";
import { rooms } from "../server";

export const useBarel = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBarel(data.username));
        updateGameState(io, roomName);
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}