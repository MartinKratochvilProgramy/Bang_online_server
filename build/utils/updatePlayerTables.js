"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.updatePlayerTables = void 0;
var server_1 = require("../server");
var compareTables_1 = require("./compareTables");
function updatePlayerTables(io, roomName) {
    for (var i = 0; i < server_1.rooms[roomName].players.length; i++) {
        var player = server_1.rooms[roomName].players[i];
        io.to(roomName).emit("update_table", {
            username: player.username,
            table: server_1.rooms[roomName].game.getPlayerTable(player.username)
        });
        // emitTable(io, roomName, player);
    }
}
exports.updatePlayerTables = updatePlayerTables;
function emitTable(io, roomName, player) {
    var prevTable = server_1.rooms[roomName].game.getPlayerPrevTable(player.username);
    var currentTable = server_1.rooms[roomName].game.getPlayerTable(player.username);
    console.log(prevTable, currentTable);
    if (!(0, compareTables_1.compareTables)(prevTable, currentTable)) {
        console.log("true for", player);
        io.to(roomName).emit("update_table", {
            username: player.username,
            table: currentTable
        });
        server_1.rooms[roomName].game.players[player.username].prevTable = __spreadArray([], currentTable, true);
    }
}
