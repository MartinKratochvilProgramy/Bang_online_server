import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";

export const placeBlueCardOnTable = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.placeBlueCardOnTable(data.card));

        updatePlayersHand(io, roomName, username);

        updatePlayersTable(io, roomName, username);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}