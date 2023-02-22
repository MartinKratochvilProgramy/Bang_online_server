"use strict";
exports.__esModule = true;
exports.updateGameState = void 0;
var server_1 = require("../server");
var updateGameState = function (io, roomName) {
    try {
        io.to(roomName).emit("update_hands");
        io.to(roomName).emit("update_top_stack_card", server_1.rooms[roomName].game.getTopStackCard());
        io.to(roomName).emit("update_all_players_info", server_1.rooms[roomName].game.getAllPlayersInfo());
    }
    catch (error) {
        console.log("Error on updateGameState():");
        console.log(error);
    }
};
exports.updateGameState = updateGameState;
