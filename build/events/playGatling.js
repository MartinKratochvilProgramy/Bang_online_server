"use strict";
exports.__esModule = true;
exports.playGatling = void 0;
var server_1 = require("../server");
var updateGameState_1 = require("../utils/updateGameState");
var playGatling = function (io, data) {
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useGatling(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        (0, updateGameState_1.updateGameState)(io, roomName);
        if (server_1.rooms[roomName].game.players[data.username].character.name === "Jourdonnais")
            return; // if Jourdonnais played Gatling, don't activate his Barel
        // search player characters, if there is Jourdonnais, let him use Barel
        for (var _i = 0, _a = Object.keys(server_1.rooms[roomName].game.players); _i < _a.length; _i++) {
            var player = _a[_i];
            if (server_1.rooms[roomName].game.players[player].character.name === "Jourdonnais") {
                io.to(roomName).emit("jourdonnais_can_use_barel");
            }
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playGatling = playGatling;
