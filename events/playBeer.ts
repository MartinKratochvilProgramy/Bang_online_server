import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playBeer = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBeer(data.username, data.cardDigit, data.cardType));

        updatePlayersHand(io, roomName, username);

        updateTopStackCard(io, roomName);

        io.to(roomName).emit("update_health", {
            username: data.username,
            health: rooms[roomName].game!.players[data.username].character.health
        });
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}