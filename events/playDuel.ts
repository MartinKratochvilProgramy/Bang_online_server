import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playDuel = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    const username = rooms[roomName].game!.getNameOfCurrentTurnPlayer();

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useDuel(data.target, data.cardDigit, data.cardType));
        io.to(roomName).emit("duel_active", rooms[roomName].game!.duelActive);
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        const player1 = rooms[roomName].game!.duelPlayers[0];
        const player2 = rooms[roomName].game!.duelPlayers[1];

        updatePlayersHand(io, roomName, player1);
        updatePlayersHand(io, roomName, player2);

        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}