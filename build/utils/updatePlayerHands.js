"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.updatePlayerHands = void 0;
var server_1 = require("../server");
var compareHands_1 = require("./compareHands");
function updatePlayerHands(io, roomName) {
    for (var i = 0; i < server_1.rooms[roomName].players.length; i++) {
        var player = server_1.rooms[roomName].players[i];
        emitHandToSocket(io, roomName, player);
    }
}
exports.updatePlayerHands = updatePlayerHands;
function emitHandToSocket(io, roomName, player) {
    var prevHand = server_1.rooms[roomName].game.getPlayerPrevHand(player.username);
    var currentHand = server_1.rooms[roomName].game.getPlayerHand(player.username);
    if (!(0, compareHands_1.compareHands)(prevHand, currentHand) ||
        server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer() === player.username ||
        server_1.rooms[roomName].game.duelActive ||
        server_1.rooms[roomName].game.indianiActive ||
        server_1.rooms[roomName].game.gatlingActive ||
        server_1.rooms[roomName].game.players[player.username].isLosingHealth) {
        io.to(player.id).emit("my_hand", currentHand);
        io.to(roomName).emit("update_number_of_cards", {
            username: player.username,
            handSize: currentHand.length
        });
        server_1.rooms[roomName].game.players[player.username].prevHand = __spreadArray([], currentHand, true);
    }
}
