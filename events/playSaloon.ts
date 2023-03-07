import { updateGameState } from "../utils";
import { rooms } from "../server";

export const playSaloon = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", rooms[roomName].game.useSaloon(data.username, data.cardDigit, data.cardType));
        updateGameState(io, roomName);
        for (let i = 0; i < rooms[roomName].game.playerNames.length; i++) {
            const playerName = rooms[roomName].game.playerNames[i];
            io.to(roomName).emit("update_health", {
                username: playerName,
                health: rooms[roomName].game.players[playerName].character.health
            });
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}