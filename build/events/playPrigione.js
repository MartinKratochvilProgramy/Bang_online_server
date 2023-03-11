"use strict";
exports.__esModule = true;
exports.playPrigione = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayersTable_1 = require("../utils/updatePlayersTable");
var playPrigione = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    var target = data.target;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.playPrigione(data.target, data.activeCard));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, target);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playPrigione = playPrigione;
