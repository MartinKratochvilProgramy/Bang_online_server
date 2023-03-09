"use strict";
exports.__esModule = true;
exports.playBangAsCJ = void 0;
var server_1 = require("../server");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playBangAsCJ = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBangAsCJ(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
        if (!server_1.rooms[roomName].game.gatlingActive) {
            var currentPlayer_1 = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
            var currentPlayerID = server_1.rooms[roomName].players.find(function (player) { return player.username === currentPlayer_1; }).id;
            io.to(currentPlayerID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(currentPlayer_1));
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playBangAsCJ = playBangAsCJ;
