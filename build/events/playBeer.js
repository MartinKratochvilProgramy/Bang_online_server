"use strict";
exports.__esModule = true;
exports.playBeer = void 0;
var server_1 = require("../server");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playBeer = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBeer(data.username, data.cardDigit, data.cardType));
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
        io.to(roomName).emit("update_health", {
            username: data.username,
            health: server_1.rooms[roomName].game.players[data.username].character.health
        });
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playBeer = playBeer;
