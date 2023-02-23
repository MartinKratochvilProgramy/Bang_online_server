"use strict";
exports.__esModule = true;
exports.playMancatoInDuel = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var playMancatoInDuel = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useMancatoInDuel(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        (0, utils_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playMancatoInDuel = playMancatoInDuel;