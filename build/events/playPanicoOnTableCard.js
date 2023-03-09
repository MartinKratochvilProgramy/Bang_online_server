"use strict";
exports.__esModule = true;
exports.playPanicoOnTableCard = void 0;
var server_1 = require("../server");
var updatePlayerTables_1 = require("../utils/updatePlayerTables");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playPanicoOnTableCard = function (io, data) {
    var _a;
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    var username = (_a = server_1.rooms[roomName].game) === null || _a === void 0 ? void 0 : _a.getNameOfCurrentTurnPlayer();
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.usePanicoOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType));
        var userID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(userID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playPanicoOnTableCard = playPanicoOnTableCard;
