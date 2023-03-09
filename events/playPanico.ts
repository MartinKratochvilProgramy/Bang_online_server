import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayerTables } from "../utils/updatePlayerTables";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playPanico = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    const username = rooms[roomName].game?.getNameOfCurrentTurnPlayer()!;
    const target = data.target;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.usePanico(data.target, data.cardDigit, data.cardType));

        updatePlayersHand(io, roomName, username);
        updatePlayersHand(io, roomName, target);

        updatePlayerTables(io, roomName);

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}