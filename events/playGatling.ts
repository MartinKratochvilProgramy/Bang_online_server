import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playGatling = (io: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useGatling(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        updateGameState(io, roomName);

        if (rooms[roomName].game!.players[data.username].character.name === "Jourdonnais") return; // if Jourdonnais played Gatling, don't activate his Barel
        // search player characters, if there is Jourdonnais, let him use Barel
        for (const player of Object.keys(rooms[roomName].game!.players)) {
            if (rooms[roomName].game!.players[player].character.name === "Jourdonnais") {
                io.to(roomName).emit("jourdonnais_can_use_barel");
            }
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}