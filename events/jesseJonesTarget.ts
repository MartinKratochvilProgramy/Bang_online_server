import { updateGameState } from "../utils";
import { rooms } from "../server";

export const jesseJonesTarget = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        rooms[roomName].game.jesseJonesTarget(data.target);
        updateGameState(io, roomName);
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}