import { updateGameState, endTurn } from "../utils";
import { rooms } from "../server";

export const discard = (io: any, socket: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        if (rooms[roomName].game === null) return;

        rooms[roomName].game!.discard(data.card.name, data.card.digit, data.card.type, data.username);
        
        if (rooms[roomName].game!.players[data.username].hand.length <= rooms[roomName].game!.players[data.username].character.health) {
            // special case for when SK is discarding
            if (rooms[roomName].game!.players[data.username].character.name !== "Sid Ketchum") {
                // if less of equal cards in hand -> endTurn
                socket.emit("end_discard");
                endTurn(io, roomName);
            } else {
                updateGameState(io, roomName)
            }
        } else {
            updateGameState(io, roomName)
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}