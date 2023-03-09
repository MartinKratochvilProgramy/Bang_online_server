"use strict";
exports.__esModule = true;
exports.getEmporioCard = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var getEmporioCard = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        server_1.rooms[roomName].game.getEmporioCard(data.username, data.card);
        // send emporio state to clients
        io.to(roomName).emit("emporio_state", { cards: server_1.rooms[roomName].game.emporio, nextEmporioTurn: server_1.rooms[roomName].game.nextEmporioTurn });
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        if (server_1.rooms[roomName].game.emporio.length === 0) {
            // activate current turn player's hand if emporio empty
            var currentPlayer_1 = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
            var currentPlayerID = server_1.rooms[roomName].players.find(function (player) { return player.username === currentPlayer_1; }).id;
            io.to(currentPlayerID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(currentPlayer_1));
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.getEmporioCard = getEmporioCard;
