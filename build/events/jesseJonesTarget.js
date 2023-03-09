"use strict";
exports.__esModule = true;
exports.jesseJonesTarget = void 0;
var server_1 = require("../server");
var jesseJonesTarget = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    var target = data.target;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.jesseJonesTarget(target));
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        var targetID = server_1.rooms[roomName].players.find(function (player) { return player.username === target; }).id;
        io.to(targetID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(target));
        io.to(roomName).emit("update_number_of_cards", {
            username: target,
            handSize: server_1.rooms[roomName].game.getPlayerHand(target).length
        });
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.jesseJonesTarget = jesseJonesTarget;
