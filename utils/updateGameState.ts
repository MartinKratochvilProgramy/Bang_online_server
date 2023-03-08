import { updatePlayerHands } from "./updatePlayerHands";
import { updatePlayerTables } from "./updatePlayerTables";
import { updateTopStackCard } from "./updateTopStackCard";


export const updateGameState = (io: any, roomName: string) => {
    try {
        updatePlayerHands(io, roomName);
        updatePlayerTables(io, roomName);
        updateTopStackCard(io, roomName);

        // io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
    } catch (error) {
        console.log(`Error on updateGameState():`);
        console.log(error);
    }
}
