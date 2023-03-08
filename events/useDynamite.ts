import { rooms } from "../server";
import { endTurn } from "../utils/endTurn";
import { updatePlayerTables } from "../utils/updatePlayerTables";

export const useDynamite = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    if (rooms[roomName].game === null) return;
    try {
        const message = rooms[roomName].game!.useDynamite(username, data.card);
        io.to(roomName).emit("console", message);

        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })
        updatePlayerTables(io, roomName);

        if (message[message.length - 1] === "Game ended") {
            // game over      
            // emit who won
            io.to(roomName).emit("game_ended", message[message.length - 2]);
            console.log("Game ended in room ", roomName);
            return;
        }
        if (rooms[roomName].game!.players[username].character.health <= 0) {
            endTurn(io, roomName); // TODO: updateGameState is also called here
            return;
        }

        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());

        if (!rooms[roomName].game!.getPlayerIsInPrison(username) && !rooms[roomName].game!.getPlayerHasDynamite(username)) {
            if (rooms[roomName].game!.players[username].character.name === "Kit Carlson") {
                io.to(roomName).emit("update_draw_choices", "Kit Carlson");

            } else if (rooms[roomName].game!.players[username].character.name === "Lucky Duke") {
                io.to(roomName).emit("update_draw_choices", "Lucky Duke");

            } else if (rooms[roomName].game!.players[username].character.name === "Pedro Ramirez" && rooms[roomName].game!.stack.length > 0) {
                io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");

            } else if (rooms[roomName].game!.players[username].character.name === "Jesse Jones") {
                io.to(roomName).emit("update_draw_choices", "Jesse Jones");
            }
        }

    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}