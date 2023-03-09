"use strict";
exports.__esModule = true;
exports.playCatBallou = void 0;
var server_1 = require("../server");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var playCatBallou = function (io, data) {
    var _a;
    var roomName = data.currentRoom;
    if (server_1.rooms[roomName].game === null)
        return;
    var username = (_a = server_1.rooms[roomName].game) === null || _a === void 0 ? void 0 : _a.getNameOfCurrentTurnPlayer();
    var target = data.target;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useCatBallou(data.target, data.cardDigit, data.cardType));
        var userID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(userID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
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
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playCatBallou = playCatBallou;
