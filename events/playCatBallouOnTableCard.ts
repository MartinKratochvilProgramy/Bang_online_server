import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const playCatBallouOnTableCard = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    const username = rooms[roomName].game?.getNameOfCurrentTurnPlayer()!;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useCatBallouOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType));

        updatePlayersHand(io, roomName, username);

        updatePlayerTables(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}