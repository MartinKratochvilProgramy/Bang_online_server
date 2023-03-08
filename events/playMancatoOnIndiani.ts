import { rooms } from "../server";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playMancatoOnIndiani = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useMancatoOnIndiani(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        io.to(roomName).emit("indiani_active", rooms[roomName].game!.indianiActive);
        
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
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