"use strict";
exports.__esModule = true;
exports.requestPlayersInRange = void 0;
var server_1 = require("../server");
var requestPlayersInRange = function (socket, data) {
    var roomName = data.currentRoom;
    try {
        socket.emit("players_in_range", server_1.rooms[roomName].game.getPlayersInRange(data.username, data.range));
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.requestPlayersInRange = requestPlayersInRange;
