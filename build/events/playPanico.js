"use strict";
exports.__esModule = true;
exports.playPanico = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayerTables_1 = require("../utils/updatePlayerTables");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playPanico = function (io, data) {
    var _a;
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    var username = (_a = server_1.rooms[roomName].game) === null || _a === void 0 ? void 0 : _a.getNameOfCurrentTurnPlayer();
    var target = data.target;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.usePanico(data.target, data.cardDigit, data.cardType));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, target);
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playPanico = playPanico;
