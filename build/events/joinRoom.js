"use strict";
exports.__esModule = true;
exports.joinRoom = void 0;
var getRoomsInfo_1 = require("../utils/getRoomsInfo");
var server_1 = require("../server");
var joinRoom = function (socket, io, data) {
    var roomName = data.currentRoom;
    try {
        socket.join(data.currentRoom);
        var username = data.username;
        // go through players, if player exists, add "_|" to username
        for (var i = 0; i < server_1.rooms[roomName].players.length; i++) {
            if (server_1.rooms[roomName].players[i].username === username) {
                username += "_|";
                socket.emit("username_changed", username);
                i = 0;
            }
        }
        var newUser = {
            username: username,
            id: socket.id
        };
        server_1.rooms[roomName].players.push(newUser);
        io.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
        io.to(data.currentRoom).emit("get_players", server_1.rooms[roomName].players);
        io.to(data.currentRoom).emit("get_messages", server_1.rooms[roomName].messages);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.joinRoom = joinRoom;
