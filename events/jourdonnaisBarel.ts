import { rooms } from "../server";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const jourdonnaisBarel = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.jourdonnaisBarel(data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        updatePlayerTables(io, roomName);

        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username))
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}