import { rooms } from "../server";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const playCatBallouOnTableCard = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    const username = rooms[roomName].game?.getNameOfCurrentTurnPlayer()!;
    
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useCatBallouOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType));
        
        const userID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(userID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
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