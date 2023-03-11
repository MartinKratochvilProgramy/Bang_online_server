"use strict";
exports.__esModule = true;
exports.playCatBallouOnTableCard = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayersTable_1 = require("../utils/updatePlayersTable");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playCatBallouOnTableCard = function (io, data) {
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    var username = data.username;
    var target = data.target;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useCatBallouOnTableCard(target, data.activeCard, data.cardName, data.cardDigit, data.cardType));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayersTable_1.updatePlayersTable)(io, roomName, target);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playCatBallouOnTableCard = playCatBallouOnTableCard;
