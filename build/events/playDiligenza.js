"use strict";
exports.__esModule = true;
exports.playDiligenza = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playDiligenza = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useDiligenza(data.username, data.cardDigit, data.cardType));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playDiligenza = playDiligenza;
