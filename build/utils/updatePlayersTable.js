"use strict";
exports.__esModule = true;
exports.updatePlayersTable = void 0;
var server_1 = require("../server");
function updatePlayersTable(io, roomName, username) {
    io.to(roomName).emit("update_table", {
        username: username,
        table: server_1.rooms[roomName].game.getPlayerTable(username)
    });
}
exports.updatePlayersTable = updatePlayersTable;
