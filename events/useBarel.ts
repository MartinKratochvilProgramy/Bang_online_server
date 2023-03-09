import { rooms } from "../server";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const useBarel = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBarel(data.username));

        updatePlayerTables(io, roomName);

        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}