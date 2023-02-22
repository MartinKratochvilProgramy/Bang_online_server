"use strict";
exports.__esModule = true;
exports.getChoiceCardLD = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var getChoiceCardLD = function (io, data) {
    var roomName = data.currentRoom;
    try {
        server_1.rooms[roomName].game.getChoiceCardLD(data.username, data.card);
        (0, utils_1.updateGameState)(io, roomName);
        io.to(roomName).emit("update_draw_choices", "Lucky Duke");
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.getChoiceCardLD = getChoiceCardLD;
