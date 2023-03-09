"use strict";
exports.__esModule = true;
exports.useDynamite = void 0;
var server_1 = require("../server");
var endTurn_1 = require("../utils/endTurn");
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
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_hand", server_1.rooms[roomName].game.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: server_1.rooms[roomName].game.getPlayerHand(username).length
        });
        if (message.includes("Dynamite exploded!")) {
            io.to(roomName).emit("update_health", {
                username: username,
                health: server_1.rooms[roomName].game.players[username].character.health
            });
        }
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
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
            if (server_1.rooms[roomName].game.players[username].character.name === "Kit Carlson") {
                io.to(roomName).emit("update_draw_choices", "Kit Carlson");
            }
            else if (server_1.rooms[roomName].game.players[username].character.name === "Lucky Duke") {
                io.to(roomName).emit("update_draw_choices", "Lucky Duke");
            }
            else if (server_1.rooms[roomName].game.players[username].character.name === "Pedro Ramirez" && server_1.rooms[roomName].game.stack.length > 0) {
                io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");
            }
            else if (server_1.rooms[roomName].game.players[username].character.name === "Jesse Jones") {
                io.to(roomName).emit("update_draw_choices", "Jesse Jones");
            }
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.useDynamite = useDynamite;
