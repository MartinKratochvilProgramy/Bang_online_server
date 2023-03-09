"use strict";
exports.__esModule = true;
exports.playBang = void 0;
var server_1 = require("../server");
var updatePlayerTables_1 = require("../utils/updatePlayerTables");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playBang = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    var target = data.target;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useBang(data.target, data.cardDigit, data.cardType, data.username));
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        var targetID = server_1.rooms[roomName].players.find(function (player) { return player.username === target; }).id;
        io.to(targetID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(target));
        io.to(roomName).emit("update_number_of_cards", {
            username: target,
            handSize: server_1.rooms[roomName].game.getPlayerHand(target).length
        });
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
        if (server_1.rooms[roomName].game.players[data.target].character.name === "Jourdonnais") {
            io.to(roomName).emit("jourdonnais_can_use_barel");
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playBang = playBang;
