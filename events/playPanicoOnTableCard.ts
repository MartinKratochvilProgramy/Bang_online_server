import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playPanicoOnTableCard = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    const username = data.username;
    const target = data.target;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.usePanicoOnTableCard(target, data.activeCard, data.cardName, data.cardDigit, data.cardType));

        updatePlayersHand(io, roomName, username);

        updatePlayersTable(io, roomName, target);

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}