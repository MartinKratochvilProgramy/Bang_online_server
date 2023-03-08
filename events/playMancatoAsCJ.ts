import { rooms } from "../server";
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
        
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })
        const targetID = rooms[roomName].players.find(player => player.username === target)!.id;
        io.to(targetID).emit("my_hand", rooms[roomName].game!.getPlayerHand(target));
        io.to(roomName).emit("update_number_of_cards", {
            username: target,
            handSize: rooms[roomName].game!.getPlayerHand(target).length
        })
        updateTopStackCard(io, roomName);
        updatePlayerTables(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}