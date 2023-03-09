import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playEmporio = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useEmporio(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("emporio_state", { cards: rooms[roomName].game!.emporio, nextEmporioTurn: rooms[roomName].game!.nextEmporioTurn });

        updatePlayersHand(io, roomName, username);

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}