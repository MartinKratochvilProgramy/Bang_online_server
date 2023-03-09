import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayerTables } from "../utils/updatePlayerTables";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playMancatoAsCJ = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    const username = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
    const target = data.target;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useMancatoAsCJ(data.target, data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        updatePlayersHand(io, roomName, username);
        updatePlayersHand(io, roomName, target);

        updateTopStackCard(io, roomName);
        updatePlayerTables(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}