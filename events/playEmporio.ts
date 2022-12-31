import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playEmporio = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game.useEmporio(data.username, data.cardDigit, data.cardType));
        // send emporio state to clients
        io.to(roomName).emit("emporio_state", { cards: rooms[roomName].game.emporio, nextEmporioTurn: rooms[roomName].game.nextEmporioTurn });
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}