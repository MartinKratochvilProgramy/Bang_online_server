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
        for (var i = 0; i < server_1.rooms[roomName].game.playerNames.length; i++) {
            var playerName = server_1.rooms[roomName].game.playerNames[i];
            io.to(roomName).emit("update_health", {
                username: playerName,
                health: server_1.rooms[roomName].game.players[playerName].character.health
            });
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playSaloon = playSaloon;
