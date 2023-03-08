import { updateGameState } from "../utils";
import { rooms } from "../server";

export const getEmporioCard = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        rooms[roomName].game!.getEmporioCard(data.username, data.card);
        // send emporio state to clients
        io.to(roomName).emit("emporio_state", { cards: rooms[roomName].game!.emporio, nextEmporioTurn: rooms[roomName].game!.nextEmporioTurn });
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}