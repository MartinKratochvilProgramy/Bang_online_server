"use strict";
exports.__esModule = true;
exports.usePrigione = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var usePrigione = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.usePrigione(data.username, data.card));
        (0, utils_1.updateGameState)(io, roomName);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
        io.to(roomName).emit("current_player", currentPlayer);
        if (server_1.rooms[roomName].game.getPlayerIsInPrison(currentPlayer) || server_1.rooms[roomName].game.getPlayerHasDynamite(currentPlayer))
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
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.usePrigione = usePrigione;
