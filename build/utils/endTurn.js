"use strict";
exports.__esModule = true;
exports.endTurn = void 0;
var server_1 = require("../server");
var updatePlayerTables_1 = require("./updatePlayerTables");
var updateTopStackCard_1 = require("./updateTopStackCard");
var endTurn = function (io, roomName) {
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        var prevPlayer_1 = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get prev player
        var prevPlayerID = server_1.rooms[roomName].players.find(function (player) { return player.username === prevPlayer_1; }).id;
        io.to(roomName).emit("console", server_1.rooms[roomName].game.endTurn());
        var currentPlayer_1 = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
        var currentPlayerID = server_1.rooms[roomName].players.find(function (player) { return player.username === currentPlayer_1; }).id;
        io.to(roomName).emit("current_player", currentPlayer_1);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        // update game state
        io.to(prevPlayerID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(prevPlayer_1));
        io.to(currentPlayerID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(currentPlayer_1));
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
        if (server_1.rooms[roomName].game.getPlayerIsInPrison(currentPlayer_1))
            return;
        if (server_1.rooms[roomName].game.getPlayerHasDynamite(currentPlayer_1))
            return;
        if (server_1.rooms[roomName].game.players[currentPlayer_1].character.name === "Kit Carlson") {
            io.to(currentPlayerID).emit("update_draw_choices", "Kit Carlson");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer_1].character.name === "Lucky Duke") {
            io.to(currentPlayerID).emit("update_draw_choices", "Lucky Duke");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer_1].character.name === "Pedro Ramirez" && server_1.rooms[roomName].game.stack.length > 0) {
            io.to(currentPlayerID).emit("update_draw_choices", "Pedro Ramirez");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer_1].character.name === "Jesse Jones") {
            io.to(currentPlayerID).emit("update_draw_choices", "Jesse Jones");
        }
    }
    catch (error) {
        console.log("Error on endTurn():");
        console.log(error);
    }
};
exports.endTurn = endTurn;
