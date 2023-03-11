"use strict";
exports.__esModule = true;
exports.endTurn = void 0;
var server_1 = require("../server");
var updateDrawChoices_1 = require("./updateDrawChoices");
var updatePlayersHand_1 = require("./updatePlayersHand");
var updatePlayersTable_1 = require("./updatePlayersTable");
var endTurn = function (io, roomName) {
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.endTurn());
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, currentPlayer);
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, currentPlayer);
        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        if (server_1.rooms[roomName].game.getPlayerIsInPrison(currentPlayer))
            return;
        if (server_1.rooms[roomName].game.getPlayerHasDynamite(currentPlayer))
            return;
        (0, updateDrawChoices_1.updateDrawChoices)(io, roomName, currentPlayer);
    }
    catch (error) {
        console.log("Error on endTurn():");
        console.log(error);
    }
};
exports.endTurn = endTurn;
