"use strict";
exports.__esModule = true;
exports.discard = void 0;
var endTurn_1 = require("../utils/endTurn");
var server_1 = require("../server");
var updateTopStackCard_1 = require("../utils/updateTopStackCard");
var discard = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    try {
        if (server_1.rooms[roomName].game === null)
            return;
        server_1.rooms[roomName].game.discard(data.card.name, data.card.digit, data.card.type, username);
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        if (server_1.rooms[roomName].game.players[username].hand.length <= server_1.rooms[roomName].game.players[username].character.health) {
            io.to(socketID).emit("end_discard");
            (0, endTurn_1.endTurn)(io, roomName);
        }
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        (0, updateTopStackCard_1.updateTopStackCard)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.discard = discard;
