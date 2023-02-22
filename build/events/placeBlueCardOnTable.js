"use strict";
exports.__esModule = true;
exports.placeBlueCardOnTable = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var placeBlueCardOnTable = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.placeBlueCardOnTable(data.card));
        (0, utils_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.placeBlueCardOnTable = placeBlueCardOnTable;
