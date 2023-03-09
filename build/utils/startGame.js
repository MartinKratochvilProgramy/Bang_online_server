"use strict";
exports.__esModule = true;
exports.startGame = void 0;
var server_1 = require("../server");
var updatePlayerHands_1 = require("./updatePlayerHands");
var startGame = function (io, roomName) {
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.startGame());
        var characters = [];
        for (var _i = 0, _a = Object.keys(server_1.rooms[roomName].game.players); _i < _a.length; _i++) {
            var player = _a[_i];
            characters.push({ playerName: player, character: server_1.rooms[roomName].game.players[player].character.name });
        }
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
        io.to(roomName).emit("characters", characters);
        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(roomName).emit("update_draw_choices", "Kit Carlson");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(roomName).emit("update_draw_choices", "Lucky Duke");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(roomName).emit("update_draw_choices", "Jesse Jones");
        }
        io.to(roomName).emit("game_started", { allPlayersInfo: server_1.rooms[roomName].game.getAllPlayersInfo(), allCharactersInfo: server_1.rooms[roomName].game.getCharacters() });
        (0, updatePlayerHands_1.updatePlayerHands)(io, roomName);
    }
    catch (error) {
        console.log("Error on startGame():");
        console.log(error);
    }
};
exports.startGame = startGame;
