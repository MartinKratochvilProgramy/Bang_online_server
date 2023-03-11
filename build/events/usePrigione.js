"use strict";
exports.__esModule = true;
exports.usePrigione = void 0;
var server_1 = require("../server");
var updateDrawChoices_1 = require("../utils/updateDrawChoices");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayersTable_1 = require("../utils/updatePlayersTable");
var usePrigione = function (io, data) {
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.usePrigione(data.username, data.card));
        var username = data.username;
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, username);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
        io.to(roomName).emit("current_player", currentPlayer);
        if (server_1.rooms[roomName].game.getPlayerIsInPrison(currentPlayer) || server_1.rooms[roomName].game.getPlayerHasDynamite(currentPlayer))
            return;
        (0, updateDrawChoices_1.updateDrawChoices)(io, roomName, currentPlayer);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.usePrigione = usePrigione;
