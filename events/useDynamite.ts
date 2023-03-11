import { rooms } from "../server";
import { endTurn } from "../utils/endTurn";
import { updateDrawChoices } from "../utils/updateDrawChoices";
import { updatePlayersHand } from "../utils/updatePlayersHand";
import { updatePlayersTable } from "../utils/updatePlayersTable";

export const useDynamite = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    const nextPlayer = rooms[roomName].game!.getNameOfNextTurnPlayer();

    if (rooms[roomName].game === null) return;

    try {
        const message = rooms[roomName].game!.useDynamite(username, data.card);

        io.to(roomName).emit("console", message);

        updatePlayersHand(io, roomName, username);

        updatePlayersTable(io, roomName, username);
        updatePlayersTable(io, roomName, nextPlayer);

        if (message.includes("Dynamite exploded!")) {
            io.to(roomName).emit("update_health", {
                username: username,
                health: rooms[roomName].game!.players[username].character.health
            });
        }

        if (message.includes("Game ended")) {
            // game over      
            // emit who won
            io.to(roomName).emit("game_ended", message[message.length - 2]);
            console.log("Game ended in room ", roomName);
            return;
        }

        if (rooms[roomName].game!.players[username].character.health <= 0) {
            endTurn(io, roomName);
            return;
        }

        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());

        if (!rooms[roomName].game!.getPlayerIsInPrison(username) && !rooms[roomName].game!.getPlayerHasDynamite(username)) {
            const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
            updateDrawChoices(io, roomName, currentPlayer);
        }

    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}