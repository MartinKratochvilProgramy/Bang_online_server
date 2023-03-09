"use strict";
exports.__esModule = true;
exports.updateGameState = void 0;
var updatePlayerHands_1 = require("./updatePlayerHands");
var updatePlayerTables_1 = require("./updatePlayerTables");
var updateTopStackCard_1 = require("./updateTopStackCard");
var updateGameState = function (io, roomName) {
    try {
        (0, updatePlayerHands_1.updatePlayerHands)(io, roomName);
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
        // io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
    }
    catch (error) {
        console.log("Error on updateGameState():");
        console.log(error);
    }
};
exports.updateGameState = updateGameState;
