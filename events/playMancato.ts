import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playMancato = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useMancato(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        updatePlayersHand(io, roomName, username);

        // update current player hand -> set playable
        const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
        const currentPlayerID = rooms[roomName].players.find(player => player.username === currentPlayer)!.id;
        io.to(currentPlayerID).emit("my_hand", rooms[roomName].game!.getPlayerHand(currentPlayer));

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}