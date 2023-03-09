"use strict";
exports.__esModule = true;
exports.playDuel = void 0;
var server_1 = require("../server");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playDuel = function (io, data) {
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    var username = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useDuel(data.target, data.cardDigit, data.cardType));
        io.to(roomName).emit("duel_active", server_1.rooms[roomName].game.duelActive);
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        var player1_1 = server_1.rooms[roomName].game.duelPlayers[0];
        var player2_1 = server_1.rooms[roomName].game.duelPlayers[1];
        var socketID1 = server_1.rooms[roomName].players.find(function (player) { return player.username === player1_1; }).id;
        var socketID2 = server_1.rooms[roomName].players.find(function (player) { return player.username === player2_1; }).id;
        io.to(socketID1).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(player1_1));
        io.to(socketID2).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(player2_1));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playDuel = playDuel;
