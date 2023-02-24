"use strict";
exports.__esModule = true;
exports.getChoiceCardKC = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var updatePlayerHands_1 = require("../utils/updatePlayerHands");
var getChoiceCardKC = function (io, data) {
    var roomName = data.currentRoom;
    try {
        server_1.rooms[roomName].game.getChoiceCardKC(data.username, data.card);
        (0, utils_1.updateGameState)(io, roomName);
        io.to(roomName).emit("update_draw_choices", "Kit Carlson");
        (0, updatePlayerHands_1.updatePlayerHands)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.getChoiceCardKC = getChoiceCardKC;
