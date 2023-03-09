import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";

export const jesseJonesTarget = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    const target = data.target;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.jesseJonesTarget(target));

        updatePlayersHand(io, roomName, username);
        updatePlayersHand(io, roomName, target);

        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}