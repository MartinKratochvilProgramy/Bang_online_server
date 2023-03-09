"use strict";
exports.__esModule = true;
exports.useDynamite = void 0;
var server_1 = require("../server");
var endTurn_1 = require("../utils/endTurn");
var updateDrawChoices_1 = require("../utils/updateDrawChoices");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayerTables_1 = require("../utils/updatePlayerTables");
var useDynamite = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        var message = server_1.rooms[roomName].game.useDynamite(username, data.card);
        console.log(message);
        io.to(roomName).emit("console", message);
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
        if (message.includes("Dynamite exploded!")) {
            io.to(roomName).emit("update_health", {
                username: username,
                health: server_1.rooms[roomName].game.players[username].character.health
            });
        }
        if (message.includes("Game ended")) {
            // game over      
            // emit who won
            io.to(roomName).emit("game_ended", message[message.length - 2]);
            console.log("Game ended in room ", roomName);
            return;
        }
        if (server_1.rooms[roomName].game.players[username].character.health <= 0) {
            (0, endTurn_1.endTurn)(io, roomName);
            return;
        }
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        if (!server_1.rooms[roomName].game.getPlayerIsInPrison(username) && !server_1.rooms[roomName].game.getPlayerHasDynamite(username)) {
            var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
            (0, updateDrawChoices_1.updateDrawChoices)(io, roomName, currentPlayer);
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.useDynamite = useDynamite;
