"use strict";
exports.__esModule = true;
exports.startGame = void 0;
var server_1 = require("../server");
var updateDrawChoices_1 = require("./updateDrawChoices");
var updatePlayerHands_1 = require("./updatePlayerHands");
var startGame = function (io, roomName) {
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        var message = server_1.rooms[roomName].game.startGame();
        io.to(roomName).emit("console", message);
        var characters = [];
        for (var _i = 0, _a = Object.keys(server_1.rooms[roomName].game.players); _i < _a.length; _i++) {
            var player = _a[_i];
            characters.push({ playerName: player, character: server_1.rooms[roomName].game.players[player].character.name });
        }
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
        io.to(roomName).emit("characters", characters);
        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        (0, updateDrawChoices_1.updateDrawChoices)(io, roomName, currentPlayer);
        io.to(roomName).emit("game_started", { allPlayersInfo: server_1.rooms[roomName].game.getAllPlayersInfo(), allCharactersInfo: server_1.rooms[roomName].game.getCharacters() });
        (0, updatePlayerHands_1.updatePlayerHands)(io, roomName);
    }
    catch (error) {
        console.log("Error on startGame():");
        console.log(error);
    }
};
exports.startGame = startGame;
