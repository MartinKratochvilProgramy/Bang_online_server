"use strict";
exports.__esModule = true;
exports.playEmporio = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var playEmporio = function (io, data) {
    var roomName = data.currentRoom;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.useEmporio(data.username, data.cardDigit, data.cardType));
        // send emporio state to clients
        io.to(roomName).emit("emporio_state", { cards: server_1.rooms[roomName].game.emporio, nextEmporioTurn: server_1.rooms[roomName].game.nextEmporioTurn });
        (0, utils_1.updateGameState)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.playEmporio = playEmporio;
