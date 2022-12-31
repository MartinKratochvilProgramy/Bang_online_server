import { rooms } from "../server";

export const startGame = (io: any, roomName: any) => {
    try {
        io.to(roomName).emit("console", rooms[roomName].game.startGame());

        let characters = []
        for (var player of Object.keys(rooms[roomName].game.players)) {
            characters.push({ playerName: player, character: rooms[roomName].game.players[player].character.name })
        }
        io.to(roomName).emit("characters", characters);
        io.to(roomName).emit("current_player", rooms[roomName].game.getNameOfCurrentTurnPlayer());
        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());

        const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player

        if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(roomName).emit("update_draw_choices", "Kit Carlson");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(roomName).emit("update_draw_choices", "Lucky Duke");

        } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(roomName).emit("update_draw_choices", "Jesse Jones");

        }

        io.to(roomName).emit("game_started", { allPlayersInfo: rooms[roomName].game.getAllPlayersInfo(), allCharactersInfo: rooms[roomName].game.getCharacters() });
    } catch (error) {
        console.log(`Error on startGame():`);
        console.log(error);
    }
}