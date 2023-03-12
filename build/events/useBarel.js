"use strict";
exports.__esModule = true;
exports.useBarel = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayersTable_1 = require("../utils/updatePlayersTable");
var useBarel = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBarel(username));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer());
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, username);
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.useBarel = useBarel;
