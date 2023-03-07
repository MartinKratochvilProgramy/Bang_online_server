"use strict";
exports.__esModule = true;
exports.loseHealth = void 0;
var utils_1 = require("../utils");
var server_1 = require("../server");
var updatePlayerHands_1 = require("../utils/updatePlayerHands");
var loseHealth = function (io, data) {
    var roomName = data.currentRoom;
    var username = data.username;
    try {
        var message = server_1.rooms[roomName].game.loseHealth(username);
        io.to(roomName).emit("console", message);
        // player death -> show his role
        if (server_1.rooms[roomName].game.players[username].character.health <= 0) {
            io.to(roomName).emit("known_roles", server_1.rooms[roomName].game.knownRoles);
            (0, utils_1.updateGameState)(io, roomName);
        }
        // on indiani, emit state
        io.to(roomName).emit("indiani_active", server_1.rooms[roomName].game.indianiActive);
        io.to(roomName).emit("duel_active", server_1.rooms[roomName].game.duelActive); // this is not optimal, however fixing it would require creating loseHealthInDuel() method...
        (0, updatePlayerHands_1.updatePlayerHands)(io, roomName);
        // this is to deactivate potentially active barrel
        // TODO: optimize table update
        io.to(roomName).emit("update_table", {
            username: username,
            table: server_1.rooms[roomName].game.getPlayerTable(username)
        });
        io.to(roomName).emit("update_players_losing_health", server_1.rooms[roomName].game.getPlayersLosingHealth());
        io.to(roomName).emit("update_health", {
            username: username,
            health: server_1.rooms[roomName].game.players[username].character.health
        });
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
