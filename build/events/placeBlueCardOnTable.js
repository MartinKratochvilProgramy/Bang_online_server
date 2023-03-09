"use strict";
exports.__esModule = true;
exports.placeBlueCardOnTable = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var updatePlayerTables_1 = require("../utils/updatePlayerTables");
var placeBlueCardOnTable = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.placeBlueCardOnTable(data.card));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayerTables_1.updatePlayerTables)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.placeBlueCardOnTable = placeBlueCardOnTable;
