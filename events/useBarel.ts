import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";

export const useBarel = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBarel(username));

        updatePlayersHand(io, roomName, rooms[roomName].game!.getNameOfCurrentTurnPlayer())

        updatePlayersTable(io, roomName, username);

        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}