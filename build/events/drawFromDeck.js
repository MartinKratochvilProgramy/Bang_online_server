"use strict";
exports.__esModule = true;
exports.drawFromDeck = void 0;
var server_1 = require("../server");
var drawFromDeck = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.drawFromDeck(2, data.username));
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.drawFromDeck = drawFromDeck;
