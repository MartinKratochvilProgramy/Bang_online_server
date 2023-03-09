import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playMancatoOnIndiani = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useMancatoOnIndiani(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        io.to(roomName).emit("indiani_active", rooms[roomName].game!.indianiActive);

        updatePlayersHand(io, roomName, username);

        updateTopStackCard(io, roomName);

        // check indiani state, if over, update current player's hand
        if (!rooms[roomName].game!.indianiActive) {
            const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer()
            const currentPlayerID = rooms[roomName].players.find(player => player.username === currentPlayer)!.id;
            io.to(currentPlayerID).emit("my_hand", rooms[roomName].game!.getPlayerHand(currentPlayer));
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}