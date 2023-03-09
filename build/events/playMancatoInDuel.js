"use strict";
exports.__esModule = true;
exports.playMancatoInDuel = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playMancatoInDuel = function (io, data) {
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useMancatoInDuel(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        var player1 = server_1.rooms[roomName].game.duelPlayers[0];
        var player2 = server_1.rooms[roomName].game.duelPlayers[1];
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, player1);
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, player2);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playMancatoInDuel = playMancatoInDuel;
