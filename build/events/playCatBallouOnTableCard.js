"use strict";
exports.__esModule = true;
exports.playCatBallouOnTableCard = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var playCatBallouOnTableCard = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useCatBallouOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType));
        (0, utils_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playCatBallouOnTableCard = playCatBallouOnTableCard;
