"use strict";
exports.__esModule = true;
exports.discard = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var discard = function (io, socket, data) {
    var roomName = data.currentRoom;
    try {
        server_1.rooms[roomName].game.discard(data.card.name, data.card.digit, data.card.type, data.username);
        if (server_1.rooms[roomName].game.players[data.username].hand.length <= server_1.rooms[roomName].game.players[data.username].character.health) {
            // special case for when SK is discarding
            if (server_1.rooms[roomName].game.players[data.username].character.name !== "Sid Ketchum") {
                // if less of equal cards in hand -> endTurn
                socket.emit("end_discard");
                (0, utils_1.endTurn)(io, roomName);
            }
            else {
                (0, utils_1.updateGameState)(io, roomName);
            }
        }
        else {
            (0, utils_1.updateGameState)(io, roomName);
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.discard = discard;
