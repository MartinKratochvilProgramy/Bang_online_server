import { rooms } from "../server";
import { updateDrawChoices } from "./updateDrawChoices";
import { updatePlayersHand } from "./updatePlayersHand";

export const endTurn = (io: any, roomName: any) => {
    if (rooms[roomName].game === null) return;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.endTurn());

        const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer(); // get current player

        updatePlayersHand(io, roomName, currentPlayer);

        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());

        if (rooms[roomName].game!.getPlayerIsInPrison(currentPlayer)) return;
        if (rooms[roomName].game!.getPlayerHasDynamite(currentPlayer)) return;

        updateDrawChoices(io, roomName, currentPlayer);

    } catch (error) {
        console.log(`Error on endTurn():`);
        console.log(error);
    }
}