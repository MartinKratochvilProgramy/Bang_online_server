"use strict";
exports.__esModule = true;
exports.nextTurn = void 0;
var updateGameState_1 = require("./updateGameState");
var server_1 = require("../server");
var updateDrawChoices_1 = require("./updateDrawChoices");
var nextTurn = function (io, roomName) {
    // this is being called on disconnect or leaveRoom
    // it is therefore not that expensive to use updateGameState
    // TODO: this uses updateGameState
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
        (0, updateDrawChoices_1.updateDrawChoices)(io, roomName, currentPlayer);
        io.to(roomName).emit("current_player", currentPlayer);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        (0, updateGameState_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error on nextTurn():");
        console.log(error);
    }
};
exports.nextTurn = nextTurn;
