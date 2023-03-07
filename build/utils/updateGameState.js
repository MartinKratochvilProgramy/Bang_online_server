"use strict";
exports.__esModule = true;
exports.updateGameState = void 0;
var server_1 = require("../server");
var compareCards_1 = require("./compareCards");
var updatePlayerHands_1 = require("./updatePlayerHands");
var updatePlayerTables_1 = require("./updatePlayerTables");
var updateGameState = function (io, roomName) {
    try {
        (0, updatePlayerHands_1.updatePlayerHands)(io, roomName);
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
        // update topStackCard only if is different
        var prevTopStackCard = server_1.rooms[roomName].game.prevTopStackCard;
        var topStackCard = server_1.rooms[roomName].game.getTopStackCard();
        if (!(0, compareCards_1.compareCards)(topStackCard, prevTopStackCard)) {
            server_1.rooms[roomName].game.prevTopStackCard = topStackCard;
            io.to(roomName).emit("update_top_stack_card", topStackCard);
        }
        // io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
    }
    catch (error) {
        console.log("Error on updateGameState():");
        console.log(error);
    }
};
exports.updateGameState = updateGameState;
