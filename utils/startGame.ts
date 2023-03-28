import { rooms } from "../server";
import { updateDrawChoices } from "./updateDrawChoices";
import { updatePlayerHands } from "./updatePlayerHands";

export const startGame = (io: any, roomName: any) => {
    if (rooms[roomName].game === null) return;
    try {
        const message = rooms[roomName].game!.startGame()
        
        io.to(roomName).emit("console", message);

        let characters = []
        for (var player of Object.keys(rooms[roomName].game!.players)) {
            characters.push({ playerName: player, character: rooms[roomName].game!.players[player].character.name })
        }
        const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer(); // get current player

        io.to(roomName).emit("characters", characters);
        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());

        updateDrawChoices(io, roomName, currentPlayer);

        io.to(roomName).emit("game_started", { allPlayersInfo: rooms[roomName].game!.getAllPlayersInfo(), allCharactersInfo: rooms[roomName].game!.getCharacters() });
        updatePlayerHands(io, roomName)
    } catch (error) {
        console.log(`Error on startGame():`);
        console.log(error);
    }
}