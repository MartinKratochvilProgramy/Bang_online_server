"use strict";
exports.__esModule = true;
exports.getMyRole = void 0;
var server_1 = require("../server");
var getMyRole = function (socket, data) {
    var roomName = data.currentRoom;
    try {
        socket.emit("my_role", server_1.rooms[roomName].game.players[data.username].character.role);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.getMyRole = getMyRole;
