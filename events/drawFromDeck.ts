import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";

export const drawFromDeck = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.drawFromDeck(2, data.username));

        updatePlayersHand(io, roomName, username)

        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}