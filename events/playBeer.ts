import { rooms } from "../server";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playBeer = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBeer(data.username, data.cardDigit, data.cardType));
        
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })
        updateTopStackCard(io, roomName);
        
        io.to(roomName).emit("update_health", {
            username: data.username,
            health: rooms[roomName].game!.players[data.username].character.health
        });
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}