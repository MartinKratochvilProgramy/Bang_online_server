"use strict";
exports.__esModule = true;
exports.playMancatoInDuel = void 0;
var server_1 = require("../server");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playMancatoInDuel = function (io, data) {
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useMancatoInDuel(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        var player1_1 = server_1.rooms[roomName].game.duelPlayers[0];
        var player2_1 = server_1.rooms[roomName].game.duelPlayers[1];
        var socketID1 = server_1.rooms[roomName].players.find(function (player) { return player.username === player1_1; }).id;
        var socketID2 = server_1.rooms[roomName].players.find(function (player) { return player.username === player2_1; }).id;
        io.to(socketID1).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(player1_1));
        io.to(socketID2).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(player2_1));
        io.to(roomName).emit("update_number_of_cards", {
            username: player1_1,
            handSize: server_1.rooms[roomName].game.getPlayerHand(player1_1).length
        });
        io.to(roomName).emit("update_number_of_cards", {
            username: player2_1,
            handSize: server_1.rooms[roomName].game.getPlayerHand(player2_1).length
        });
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playMancatoInDuel = playMancatoInDuel;
