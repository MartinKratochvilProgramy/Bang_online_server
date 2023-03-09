"use strict";
exports.__esModule = true;
exports.drawFromDeck = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var drawFromDeck = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.drawFromDeck(2, data.username));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.drawFromDeck = drawFromDeck;
