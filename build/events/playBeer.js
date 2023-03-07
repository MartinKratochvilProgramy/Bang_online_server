"use strict";
exports.__esModule = true;
exports.playBeer = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var playBeer = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBeer(data.username, data.cardDigit, data.cardType));
        (0, utils_1.updateGameState)(io, roomName);
        io.to(roomName).emit("update_health", {
            username: data.username,
            health: server_1.rooms[roomName].game.players[data.username].character.health
        });
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playBeer = playBeer;
