import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playBangInDuel = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBangInDuel(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        const player1 = rooms[roomName].game!.duelPlayers[0];
        const player2 = rooms[roomName].game!.duelPlayers[1];
        
        const socketID1 = rooms[roomName].players.find(player => player.username === player1)!.id;
        const socketID2 = rooms[roomName].players.find(player => player.username === player2)!.id;

        io.to(socketID1).emit("my_hand", rooms[roomName].game!.getPlayerHand(player1));
        io.to(socketID2).emit("my_hand", rooms[roomName].game!.getPlayerHand(player2));

        io.to(roomName).emit("update_number_of_cards", {
            username: player1,
            handSize: rooms[roomName].game!.getPlayerHand(player1).length
        })
        io.to(roomName).emit("update_number_of_cards", {
            username: player2,
            handSize: rooms[roomName].game!.getPlayerHand(player2).length
        })

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}