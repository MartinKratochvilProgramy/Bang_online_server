import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playBang = (io: any, data: any) => {
    const start = Date.now()

    const roomName = data.currentRoom;
    const username = data.username;
    const target = data.target;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBang(data.target, data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        updatePlayersHand(io, roomName, username);

        updatePlayersHand(io, roomName, target);
        updatePlayersTable(io, roomName, target);

        updateTopStackCard(io, roomName);

        if (rooms[roomName].game!.players[data.target].character.name === "Jourdonnais") {
            io.to(roomName).emit("jourdonnais_can_use_barel");
        }

        const end = Date.now()
        console.log(`${end - start}ms`);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}