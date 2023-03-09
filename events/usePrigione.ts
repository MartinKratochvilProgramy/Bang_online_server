import { rooms } from "../server";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const usePrigione = (io: any, data: any) => {
    const roomName = data.currentRoom;

    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.usePrigione(data.username, data.card));

        const username = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
        updatePlayersHand(io, roomName, username);

        updatePlayerTables(io, roomName);

        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());

        const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
        io.to(roomName).emit("current_player", currentPlayer);

        if (rooms[roomName].game!.getPlayerIsInPrison(currentPlayer) || rooms[roomName].game!.getPlayerHasDynamite(currentPlayer)) return;

        if (rooms[roomName].game!.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(roomName).emit("update_draw_choices", "Kit Carlson");

        } else if (rooms[roomName].game!.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(roomName).emit("update_draw_choices", "Lucky Duke");

        } else if (rooms[roomName].game!.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game!.stack.length > 0) {
            io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");

        } else if (rooms[roomName].game!.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(roomName).emit("update_draw_choices", "Jesse Jones");
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}