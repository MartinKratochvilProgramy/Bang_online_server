"use strict";
exports.__esModule = true;
exports.endTurn = void 0;
var updateGameState_1 = require("./updateGameState");
var server_1 = require("../server");
var endTurn = function (io, roomName) {
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.endTurn());
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        (0, updateGameState_1.updateGameState)(io, roomName);
        if (server_1.rooms[roomName].game.getPlayerIsInPrison(currentPlayer))
            return;
        if (server_1.rooms[roomName].game.getPlayerHasDynamite(currentPlayer))
            return;
        if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(roomName).emit("update_draw_choices", "Kit Carlson");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(roomName).emit("update_draw_choices", "Lucky Duke");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && server_1.rooms[roomName].game.stack.length > 0) {
            io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(roomName).emit("update_draw_choices", "Jesse Jones");
        }
    }
    catch (error) {
        console.log("Error on endTurn():");
        console.log(error);
    }
};
exports.endTurn = endTurn;
