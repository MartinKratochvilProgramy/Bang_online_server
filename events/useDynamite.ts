import { updateGameState, endTurn } from "../utils";
import { rooms } from "../server";

export const useDynamite = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        const message = rooms[roomName].game.useDynamite(data.username, data.card);
        io.to(roomName).emit("console", message);

        updateGameState(io, roomName);

        if (message[message.length - 1] === "Game ended") {
            // game over      
            // emit who won
            io.to(roomName).emit("game_ended", message[message.length - 2]);
            console.log("Game ended in room ", roomName);
            return;
        }
        if (rooms[roomName].game.players[data.username].character.health <= 0) {
            endTurn(io, roomName); // TODO: updateGameState is also called here
            return;
        }
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());

        const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer();
        if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(roomName).emit("update_draw_choices", "Kit Carlson");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(roomName).emit("update_draw_choices", "Lucky Duke");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game.stack.length > 0) {
            io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(roomName).emit("update_draw_choices", "Jesse Jones");
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}