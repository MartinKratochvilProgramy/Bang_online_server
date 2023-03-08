import { rooms } from "../server";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const placeBlueCardOnTable = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.placeBlueCardOnTable(data.card));
        
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })
        updatePlayerTables(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}