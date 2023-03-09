import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const playPrigione = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.playPrigione(data.target, data.activeCard));

        updatePlayersHand(io, roomName, username);

        updatePlayerTables(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}