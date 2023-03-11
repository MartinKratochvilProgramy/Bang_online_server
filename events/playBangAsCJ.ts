import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playBangAsCJ = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBangAsCJ(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        updatePlayersHand(io, roomName, username);
        updatePlayersTable(io, roomName, username);

        updateTopStackCard(io, roomName);

        if (!rooms[roomName].game!.gatlingActive) {
            const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
            const currentPlayerID = rooms[roomName].players.find(player => player.username === currentPlayer)!.id;
            io.to(currentPlayerID).emit("my_hand", rooms[roomName].game!.getPlayerHand(currentPlayer));
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}