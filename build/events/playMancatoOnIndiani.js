"use strict";
exports.__esModule = true;
exports.playMancatoOnIndiani = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playMancatoOnIndiani = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useMancatoOnIndiani(data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        io.to(roomName).emit("indiani_active", server_1.rooms[roomName].game.indianiActive);
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
        // check indiani state, if over, update current player's hand
        if (!server_1.rooms[roomName].game.indianiActive) {
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
exports.playMancatoOnIndiani = playMancatoOnIndiani;
