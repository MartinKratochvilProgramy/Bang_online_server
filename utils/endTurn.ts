import { updateGameState } from "./updateGameState";
import { rooms } from "../server";
import { updatePlayerTables } from "./updatePlayerTables";
import { updateTopStackCard } from "./updateTopStackCard";

export const endTurn = (io: any, roomName: any) => {
    if (rooms[roomName].game === null) return;

    try {
        const prevPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer(); // get prev player
        const prevPlayerID = rooms[roomName].players.find(player => player.username === prevPlayer)!.id
        
        io.to(roomName).emit("console", rooms[roomName].game!.endTurn());
        
        const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer(); // get current player
        const currentPlayerID = rooms[roomName].players.find(player => player.username === currentPlayer)!.id

        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());

        // update game state
        io.to(prevPlayerID).emit("my_hand", rooms[roomName].game!.getPlayerHand(prevPlayer));
        io.to(currentPlayerID).emit("my_hand", rooms[roomName].game!.getPlayerHand(currentPlayer));
        updatePlayerTables(io, roomName);
        updateTopStackCard(io, roomName);


        if (rooms[roomName].game!.getPlayerIsInPrison(currentPlayer)) return;
        if (rooms[roomName].game!.getPlayerHasDynamite(currentPlayer)) return;

        if (rooms[roomName].game!.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(currentPlayerID).emit("update_draw_choices", "Kit Carlson");

        } else if (rooms[roomName].game!.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(currentPlayerID).emit("update_draw_choices", "Lucky Duke");

        } else if (rooms[roomName].game!.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game!.stack.length > 0) {
            io.to(currentPlayerID).emit("update_draw_choices", "Pedro Ramirez");

        } else if (rooms[roomName].game!.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(currentPlayerID).emit("update_draw_choices", "Jesse Jones");
        }
    } catch (error) {
        console.log(`Error on endTurn():`);
        console.log(error);
    }
}