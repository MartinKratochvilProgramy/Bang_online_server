"use strict";
exports.__esModule = true;
exports.characterChoice = void 0;
var startGame_1 = require("../utils/startGame");
var server_1 = require("../server");
var characterChoice = function (io, data) {
    var roomName = data.currentRoom;
    try {
        if (server_1.rooms[roomName].game === null)
            return;
        server_1.rooms[roomName].game.setCharacter(data.username, data.character);
        if (server_1.rooms[roomName].game.getAllPlayersChoseCharacter()) {
            // if all char choices went through, start game
            server_1.rooms[roomName].game.initRoles();
            io.to(roomName).emit("known_roles", server_1.rooms[roomName].game.knownRoles);
            (0, startGame_1.startGame)(io, roomName);
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.characterChoice = characterChoice;
