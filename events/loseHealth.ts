import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";
import { updatePlayerHands } from "../utils/updatePlayerHands";

export const loseHealth = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    if (rooms[roomName].game === null) return;
    try {
        const message = rooms[roomName].game!.loseHealth(username)
        io.to(roomName).emit("console", message);

        // player death -> show his role
        if (rooms[roomName].game!.players[username].character.health <= 0) {
            io.to(roomName).emit("known_roles", rooms[roomName].game!.knownRoles);
            // updateGameState(io, roomName);
        }

        // on indiani, emit state
        io.to(roomName).emit("indiani_active", rooms[roomName].game!.indianiActive);
        io.to(roomName).emit("duel_active", rooms[roomName].game!.duelActive);  // this is not optimal, however fixing it would require creating loseHealthInDuel() method...

        updatePlayerHands(io, roomName);

        // this is to deactivate potentially active barrel
        // TODO: optimize table update
        io.to(roomName).emit("update_table", {
            username: username,
            table: rooms[roomName].game!.getPlayerTable(username)
        })

        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());
        io.to(roomName).emit("update_health", {
            username: username,
            health: rooms[roomName].game!.players[username].character.health
        });

        if (message[message.length - 1] === "Game ended") {
            // game over      
            // emit who won
            io.to(roomName).emit("game_ended", message[message.length - 2]);
            console.log("Game ended in room ", roomName);
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}