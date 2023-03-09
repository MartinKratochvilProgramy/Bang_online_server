"use strict";
exports.__esModule = true;
exports.leaveRoom = void 0;
var server_1 = require("../server");
var getRoomsInfo_1 = require("../utils/getRoomsInfo");
var updateGameState_1 = require("../utils/updateGameState");
var nextTurn_1 = require("../utils/nextTurn");
var leaveRoom = function (socket, io, data) {
    var roomName = data.currentRoom;
    try {
        // leave socket
        socket.leave(roomName);
        // remove player from players
        server_1.rooms[roomName].players.splice(server_1.rooms[roomName].players.indexOf(data.username), 1);
        io.to(roomName).emit("get_players", server_1.rooms[roomName].players);
        if (server_1.rooms[roomName].game === null)
            return;
        if (server_1.rooms[roomName].players.length <= 0) {
            // if room empty, delete it
            delete server_1.rooms[roomName];
            console.log("Room ".concat(roomName, " deleted"));
            console.log("Existing rooms ", Object.keys(server_1.rooms));
            socket.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
        }
        else {
            if (server_1.rooms[roomName].game !== null) {
                // if game exists
                // tell game a player left
                server_1.rooms[roomName].game.removePlayer(data.username);
                // send info to client
                (0, updateGameState_1.updateGameState)(io, roomName);
                (0, nextTurn_1.nextTurn)(io, roomName);
                // if players left in game, emit to them
                io.to(roomName).emit("get_players", server_1.rooms[roomName].players);
            }
        }
        io.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.leaveRoom = leaveRoom;
