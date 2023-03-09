import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playBangInDuel = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBangInDuel(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        const player1 = rooms[roomName].game!.duelPlayers[0];
        const player2 = rooms[roomName].game!.duelPlayers[1];

        updatePlayersHand(io, roomName, player1);
        updatePlayersHand(io, roomName, player2);

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}