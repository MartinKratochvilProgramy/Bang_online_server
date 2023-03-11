"use strict";
exports.__esModule = true;
exports.playBangAsCJ = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayersTable_1 = require("../utils/updatePlayersTable");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playBangAsCJ = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBangAsCJ(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, username);
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
