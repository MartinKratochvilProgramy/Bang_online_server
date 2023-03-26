import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const useBarel = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBarel(username));

        updatePlayersHand(io, roomName, rooms[roomName].game!.getNameOfCurrentTurnPlayer())
        updatePlayersHand(io, roomName, username)

        updatePlayersTable(io, roomName, username);

        updateTopStackCard(io, roomName);

        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}