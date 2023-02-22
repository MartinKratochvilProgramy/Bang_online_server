"use strict";
exports.__esModule = true;
exports.playIndiani = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var playIndiani = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useIndiani(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("indiani_active", server_1.rooms[roomName].game.indianiActive);
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        (0, utils_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playIndiani = playIndiani;
