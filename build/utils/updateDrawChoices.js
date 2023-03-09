"use strict";
exports.__esModule = true;
exports.updateDrawChoices = void 0;
var server_1 = require("../server");
function updateDrawChoices(io, roomName, username) {
    if (server_1.rooms[roomName].game.players[username].character.name === "Kit Carlson") {
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_draw_choice", server_1.rooms[roomName].game.drawChoice);
    }
    else if (server_1.rooms[roomName].game.players[username].character.name === "Lucky Duke") {
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("my_draw_choice", server_1.rooms[roomName].game.drawChoice);
    }
    else if (server_1.rooms[roomName].game.players[username].character.name === "Pedro Ramirez" && server_1.rooms[roomName].game.stack.length > 0) {
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("update_draw_choices", "Pedro Ramirez");
    }
    else if (server_1.rooms[roomName].game.players[username].character.name === "Jesse Jones") {
        var socketID = server_1.rooms[roomName].players.find(function (player) { return player.username === username; }).id;
        io.to(socketID).emit("update_draw_choices", "Jesse Jones");
    }
}
exports.updateDrawChoices = updateDrawChoices;
