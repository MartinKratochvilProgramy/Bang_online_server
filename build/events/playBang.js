"use strict";
exports.__esModule = true;
exports.playBang = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayersTable_1 = require("../utils/updatePlayersTable");
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
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, target);
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, target);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
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
