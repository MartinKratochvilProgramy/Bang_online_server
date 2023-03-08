import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";

export const playBang = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBang(data.target, data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        updateGameState(io, roomName);

        if (rooms[roomName].game!.players[data.target].character.name === "Jourdonnais") {
            io.to(roomName).emit("jourdonnais_can_use_barel");
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}