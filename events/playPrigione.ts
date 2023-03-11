import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";

export const playPrigione = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    const target = data.target;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.playPrigione(data.target, data.activeCard));

        updatePlayersHand(io, roomName, username);

        updatePlayersTable(io, roomName, target);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}