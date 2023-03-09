import { rooms } from "../server";
import { updateDrawChoices } from "./updateDrawChoices";
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

        updateDrawChoices(io, roomName, currentPlayer);

    } catch (error) {
        console.log(`Error on endTurn():`);
        console.log(error);
    }
}