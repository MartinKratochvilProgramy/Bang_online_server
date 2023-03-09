import { rooms } from "../server";
import { updateDrawChoices } from "../utils/updateDrawChoices";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const usePrigione = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.usePrigione(data.username, data.card));

        const username = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
        updatePlayersHand(io, roomName, username);

        updatePlayerTables(io, roomName);

        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());

        const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
        io.to(roomName).emit("current_player", currentPlayer);

        if (rooms[roomName].game!.getPlayerIsInPrison(currentPlayer) || rooms[roomName].game!.getPlayerHasDynamite(currentPlayer)) return;

        updateDrawChoices(io, roomName, currentPlayer);

    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}