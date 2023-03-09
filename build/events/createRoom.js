"use strict";
exports.__esModule = true;
exports.createRoom = void 0;
var getRoomsInfo_1 = require("../utils/getRoomsInfo");
var server_1 = require("../server");
var createRoom = function (io, roomName) {
    try {
        server_1.rooms[roomName] = {
            players: [],
            messages: [],
            game: null
        };
        io.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.createRoom = createRoom;
