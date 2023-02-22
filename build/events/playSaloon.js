"use strict";
exports.__esModule = true;
exports.playSaloon = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var playSaloon = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useSaloon(data.username, data.cardDigit, data.cardType));
        (0, utils_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playSaloon = playSaloon;
