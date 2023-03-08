import { rooms } from "../server";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playDuel = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useDuel(data.target, data.cardDigit, data.cardType));
        io.to(roomName).emit("duel_active", rooms[roomName].game!.duelActive);
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        
        const player1 = rooms[roomName].game!.duelPlayers[0];
        const player2 = rooms[roomName].game!.duelPlayers[1];
        
        const socketID1 = rooms[roomName].players.find(player => player.username === player1)!.id;
        const socketID2 = rooms[roomName].players.find(player => player.username === player2)!.id;

        io.to(socketID1).emit("my_hand", rooms[roomName].game!.getPlayerHand(player1));
        io.to(socketID2).emit("my_hand", rooms[roomName].game!.getPlayerHand(player2));
        
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