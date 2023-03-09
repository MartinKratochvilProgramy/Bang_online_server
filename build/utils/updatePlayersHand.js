"use strict";
exports.__esModule = true;
exports.updatePlayersHand = void 0;
var server_1 = require("../server");
function updatePlayersHand(io, roomName, username) {
    // emit hand to player username
    // emit hand-size change to roomName
    var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
    io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
    io.to(roomName).emit("update_number_of_cards", {
        username: username,
        handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
    });
}
exports.updatePlayersHand = updatePlayersHand;
