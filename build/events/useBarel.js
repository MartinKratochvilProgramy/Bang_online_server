"use strict";
exports.__esModule = true;
exports.useBarel = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var useBarel = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBarel(data.username));
        (0, utils_1.updateGameState)(io, roomName);
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.useBarel = useBarel;