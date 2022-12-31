import { updateGameState } from "./updateGameState";
import { rooms } from "../server";

export const nextTurn = (io: any, roomName: any) => {
    try {
        const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player

        if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(roomName).emit("update_draw_choices", "Kit Carlson");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(roomName).emit("update_draw_choices", "Lucky Duke");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game.stack.length > 0) {
            io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(roomName).emit("update_draw_choices", "Jesse Jones");
        }

        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error on nextTurn():`);
        console.log(error);
    }
}