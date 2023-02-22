"use strict";
exports.__esModule = true;
exports.useDynamite = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var useDynamite = function (io, data) {
    var roomName = data.currentRoom;
    try {
        var message = server_1.rooms[roomName].game.useDynamite(data.username, data.card);
        io.to(roomName).emit("console", message);
        (0, utils_1.updateGameState)(io, roomName);
        if (message[message.length - 1] === "Game ended") {
            // game over      
            // emit who won
            io.to(roomName).emit("game_ended", message[message.length - 2]);
            console.log("Game ended in room ", roomName);
            return;
        }
        if (server_1.rooms[roomName].game.players[data.username].character.health <= 0) {
            (0, utils_1.endTurn)(io, roomName); // TODO: updateGameState is also called here
            return;
        }
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
        var currentPlayer = server_1.rooms[roomName].game.getNameOfCurrentTurnPlayer();
        if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
            io.to(roomName).emit("update_draw_choices", "Kit Carlson");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
            io.to(roomName).emit("update_draw_choices", "Lucky Duke");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && server_1.rooms[roomName].game.stack.length > 0) {
            io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");
        }
        else if (server_1.rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
            io.to(roomName).emit("update_draw_choices", "Jesse Jones");
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.useDynamite = useDynamite;
