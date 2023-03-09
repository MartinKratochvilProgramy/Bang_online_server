import { updateGameState } from "./updateGameState";
import { rooms } from "../server";
import { updateDrawChoices } from "./updateDrawChoices";

export const nextTurn = (io: any, roomName: any) => {
    // this is being called on disconnect or leaveRoom
    // it is therefore not that expensive to use updateGameState
    // TODO: this uses updateGameState
    if (rooms[roomName].game === null) return;
    try {
        const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer(); // get current player

        updateDrawChoices(io, roomName, currentPlayer);

        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error on nextTurn():`);
        console.log(error);
    }
}