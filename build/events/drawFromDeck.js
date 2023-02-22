"use strict";
exports.__esModule = true;
exports.drawFromDeck = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var drawFromDeck = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.drawFromDeck(2, data.username));
        (0, utils_1.updateGameState)(io, roomName);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.drawFromDeck = drawFromDeck;
