"use strict";
exports.__esModule = true;
exports.getMyDrawChoice = void 0;
var server_1 = require("../server");
var getMyDrawChoice = function (socket, data) {
    var roomName = data.currentRoom;
    try {
        socket.emit("my_draw_choice", server_1.rooms[roomName].game.drawChoice);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.getMyDrawChoice = getMyDrawChoice;
