import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playSaloon = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useSaloon(data.username, data.cardDigit, data.cardType));

        updatePlayersHand(io, roomName, username);

        updateTopStackCard(io, roomName);

        for (let i = 0; i < rooms[roomName].game!.playerNames.length; i++) {
            const playerName = rooms[roomName].game!.playerNames[i];
            io.to(roomName).emit("update_health", {
                username: playerName,
                health: rooms[roomName].game!.players[playerName].character.health
            });
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}