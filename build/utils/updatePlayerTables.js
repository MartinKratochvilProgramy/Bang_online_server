"use strict";
exports.__esModule = true;
exports.updatePlayerTables = void 0;
var server_1 = require("../server");
function updatePlayerTables(io, roomName) {
    for (var i = 0; i < server_1.rooms[roomName].players.length; i++) {
        var player = server_1.rooms[roomName].players[i];
        io.to(roomName).emit("update_table", {
            username: player.username,
            table: server_1.rooms[roomName].game.getPlayerTable(player.username)
        });
    }
}
exports.updatePlayerTables = updatePlayerTables;
