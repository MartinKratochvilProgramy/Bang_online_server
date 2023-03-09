"use strict";
exports.__esModule = true;
exports.jesseJonesTarget = void 0;
var server_1 = require("../server");
var updatePlayersHand_1 = require("../utils/updatePlayersHand");
var jesseJonesTarget = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    var target = data.target;
    if (server_1.rooms[roomName].game === null)
        return;
    try {
        io.to(roomName).emit("console", server_1.rooms[roomName].game.jesseJonesTarget(target));
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, username);
        (0, updatePlayersHand_1.updatePlayersHand)(io, roomName, target);
        io.to(roomName).emit("update_players_with_action_required", server_1.rooms[roomName].game.getPlayersWithActionRequired());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.jesseJonesTarget = jesseJonesTarget;
