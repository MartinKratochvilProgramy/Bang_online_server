"use strict";
exports.__esModule = true;
exports.jourdonnaisBarel = void 0;
var server_1 = require("../server");
var updatePlayersTable_1 = require("../utils/updatePlayersTable");
var jourdonnaisBarel = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.jourdonnaisBarel(data.username));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, username);
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.jourdonnaisBarel = jourdonnaisBarel;
