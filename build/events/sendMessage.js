"use strict";
exports.__esModule = true;
exports.sendMessage = void 0;
var server_1 = require("../server");
var uuid = require('uuid');
var sendMessage = function (io, data) {
    var roomName = data.currentRoom;
    try {
        if (server_1.rooms[roomName].messages !== undefined) {
            server_1.rooms[roomName].messages.push({
                username: data.username,
                message: data.message
            });
        }
        io.to(roomName).emit("get_messages", server_1.rooms[roomName].messages);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.sendMessage = sendMessage;
