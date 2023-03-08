import { endTurn } from "../utils";
import { rooms } from "../server";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const discard = (io: any, socket: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    try {
        if (rooms[roomName].game === null) return;

        rooms[roomName].game!.discard(data.card.name, data.card.digit, data.card.type, username);
        
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id
        
        if (rooms[roomName].game!.players[username].hand.length <= rooms[roomName].game!.players[username].character.health) {
            io.to(socketID).emit("end_discard");
            endTurn(io, roomName);
        } else {
            io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
            // updateGameState(io, roomName)
        }
        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}