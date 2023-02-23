"use strict";
exports.__esModule = true;
exports.playBangInDuel = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var playBangInDuel = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBangInDuel(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        (0, utils_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playBangInDuel = playBangInDuel;