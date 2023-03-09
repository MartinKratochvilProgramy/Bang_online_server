"use strict";
exports.__esModule = true;
exports.usePrigione = void 0;
var server_1 = require("../server");
var updatePlayerTables_1 = require("../utils/updatePlayerTables");
var usePrigione = function (io, data) {
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.usePrigione(data.username, data.card));
        var username_1 = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username_1; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username_1));
        io.to(roomName).emit("update_number_of_cards", {
            username: username_1,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username_1).length
        });
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
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
