"use strict";
exports.__esModule = true;
exports.loseHealth = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var loseHealth = function (io, data) {
    var roomName = data.currentRoom;
    try {
        var message = server_1.rooms[roomName].game.loseHealth(data.username);
        io.to(roomName).emit("console", message);
        // player death -> show his role
        if (server_1.rooms[roomName].game.players[data.username].character.health <= 0) {
            io.to(roomName).emit("known_roles", server_1.rooms[roomName].game.knownRoles);
            (0, utils_1.updateGameState)(io, roomName);
        }
        // on indiani, emit state
        io.to(roomName).emit("indiani_active", server_1.rooms[roomName].game.indianiActive);
        io.to(roomName).emit("duel_active", server_1.rooms[roomName].game.duelActive); // this is not optimal, however fixing it would require creating loseHealthInDuel() method...
        io.to(roomName).emit("update_hands");
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        io.to(roomName).emit("update_all_players_info", server_1.rooms[roomName].game.getAllPlayersInfo());
        if (message[message.length - 1] === "Game ended") {
            // game over      
            // emit who won
            io.to(roomName).emit("game_ended", message[message.length - 2]);
            console.log("Game ended in room ", roomName);
        }
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.loseHealth = loseHealth;
