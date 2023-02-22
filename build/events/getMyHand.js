"use strict";
exports.__esModule = true;
exports.getMyHand = void 0;
var server_1 = require("../server");
var getMyHand = function (socket, data) {
    var roomName = data.currentRoom;
    try {
        socket.emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(data.username));
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.getMyHand = getMyHand;
