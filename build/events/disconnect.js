"use strict";
exports.__esModule = true;
exports.disconnect = void 0;
var getRoomsInfo_1 = require("../utils/getRoomsInfo");
var updateGameState_1 = require("../utils/updateGameState");
var nextTurn_1 = require("../utils/nextTurn");
var server_1 = require("../server");
var disconnect = function (socket, io) {
    try {
        // user disconnected by closing the browser
        // search rooms for player
        for (var _i = 0, _a = Object.keys(server_1.rooms); _i < _a.length; _i++) {
            var room = _a[_i];
            // iterate throught players inside room
            for (var i = 0; i < server_1.rooms[room].players.length; i++) {
                if (server_1.rooms[room].game === null) {
                    // game not yet started in game -> simple splice
                    if (server_1.rooms[room].players[i].id === socket.id) {
                        var targetPlayer = {
                            username: server_1.rooms[room].players[i].username,
                            id: server_1.rooms[room].players[i].id
                        };
                        server_1.rooms[room].players.splice(server_1.rooms[room].players.indexOf(targetPlayer), 1);
                        io.to(room).emit("get_players", server_1.rooms[room].players);
                        io.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
                        if (server_1.rooms[room].players.length <= 0) {
                            // if room empty, delete it
                            delete server_1.rooms[room];
                            console.log("Room ", room, " deleted");
                            console.log("Existing rooms ", Object.keys(server_1.rooms));
                            io.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
                            return;
                        }
                    }
                }
                else {
                    // game exists
                    // if player === player who disconnected, splice him
                    if (server_1.rooms[room].players[i].id === socket.id) {
                        io.to(room).emit("console", ["".concat(server_1.rooms[room].players[i].username, " disconnected")]);
                        var message = server_1.rooms[room].game.removePlayer(server_1.rooms[room].players[i].username);
                        // if game still active, check game-end
                        // player dies when disconnecting, check game-end
                        if (message[message.length - 1] === "Game ended") {
                            // game over      
                            // emit who won
                            io.to(room).emit("game_ended", message[message.length - 2]);
                            io.to(room).emit("console", [message[message.length - 2], message[message.length - 1]]);
                        }
                        io.to(room).emit("known_roles", server_1.rooms[room].game.knownRoles);
                        server_1.rooms[room].players.splice(i, 1);
                        io.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
                        // tell game a player left if room exists
                        if (server_1.rooms[room].game && server_1.rooms[room].players.length >= 2) {
                            // if game exists, remove player from game
                            // send info to client
                            (0, updateGameState_1.updateGameState)(io, room);
                            (0, nextTurn_1.nextTurn)(io, room);
                        }
                        socket.emit("room_left");
                        if (server_1.rooms[room].players.length <= 0) {
                            // if room empty, delete it
                            delete server_1.rooms[room];
                            console.log("Room ".concat(room, " deleted"));
                            console.log("Existing rooms ", Object.keys(server_1.rooms));
                        }
                        else {
                            // if players left in game, emit to them
                            io.to(room).emit("get_players", server_1.rooms[room].players);
                            (0, updateGameState_1.updateGameState)(io, room);
                        }
                        break;
                    }
                }
            }
        }
    }
    catch (error) {
        console.log("Error on disconnect:");
        console.log(error);
    }
};
exports.disconnect = disconnect;
