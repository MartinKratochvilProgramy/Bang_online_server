"use strict";
exports.__esModule = true;
exports.startGameEvent = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var game_1 = require("../game");
var deck_1 = require("../deck");
var startGameEvent = function (io, data) {
    var roomName = data.currentRoom;
    try {
        server_1.rooms[roomName].game = new game_1.Game(data.players, deck_1.deck);
        console.log("Game started in room ", roomName, data.players);
        io.emit("rooms", (0, utils_1.getRoomsInfo)(server_1.rooms));
        io.to(roomName).emit("get_character_choices", server_1.rooms[roomName].game.genCharacterChoices());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.startGameEvent = startGameEvent;
