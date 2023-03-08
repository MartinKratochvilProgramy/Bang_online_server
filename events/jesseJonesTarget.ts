import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";

export const jesseJonesTarget = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.jesseJonesTarget(data.target));
        updateGameState(io, roomName);
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}