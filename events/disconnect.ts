import { getRoomsInfo} from "../utils/getRoomsInfo";
import { updateGameState } from "../utils/updateGameState";
import { nextTurn } from "../utils/nextTurn";
import { rooms } from "../server";
import { Player } from "../types/player";

export const disconnect = (socket: any, io: any) => {

    try {
        // user disconnected by closing the browser
        // search rooms for player
        for (var room of Object.keys(rooms)) {
            // iterate throught players inside room
            for (let i = 0; i < rooms[room].players.length; i++) {
                if (rooms[room].game === null) {
                    // game not yet started in game -> simple splice
                    if (rooms[room].players[i].id === socket.id) {
                        const targetPlayer: Player = {
                            username: rooms[room].players[i].username,
                            id: rooms[room].players[i].id
                        }
                        rooms[room].players.splice(rooms[room].players.indexOf(targetPlayer), 1);
                        io.to(room).emit("get_players", rooms[room].players);
                        io.emit("rooms", getRoomsInfo(rooms));

                        if (rooms[room].players.length <= 0) {
                            // if room empty, delete it
                            delete rooms[room];
                            console.log("Room ", room, " deleted")
                            console.log("Existing rooms ", Object.keys(rooms));
                            io.emit("rooms", getRoomsInfo(rooms));
                            return;
                        }
                    }

                } else {
                    // game exists
                    // if player === player who disconnected, splice him
                    if (rooms[room].players[i].id === socket.id) {

                        io.to(room).emit("console", [`${rooms[room].players[i].username} disconnected`]);
                        const message = rooms[room].game!.removePlayer(rooms[room].players[i].username);

                        // if game still active, check game-end
                        // player dies when disconnecting, check game-end
                        if (message[message.length - 1] === "Game ended") {
                            // game over      
                            // emit who won
                            io.to(room).emit("game_ended", message[message.length - 2]);
                            io.to(room).emit("console", [message[message.length - 2], message[message.length - 1]]);
                        }
                        io.to(room).emit("known_roles", rooms[room].game!.knownRoles);

                        rooms[room].players.splice(i, 1);
                        io.emit("rooms", getRoomsInfo(rooms));

                        // tell game a player left if room exists
                        if (rooms[room].game && rooms[room].players.length >= 2) {
                            // if game exists, remove player from game
                            // send info to client
                            updateGameState(io, room);
                            nextTurn(io, room);
                        }
                        socket.emit("room_left");


                        if (rooms[room].players.length <= 0) {
                            // if room empty, delete it
                            delete rooms[room];
                            console.log(`Room ${room} deleted`)
                            console.log("Existing rooms ", Object.keys(rooms));
                        } else {
                            // if players left in game, emit to them
                            io.to(room).emit("get_players", rooms[room].players);
                            updateGameState(io, room);
                        }
                        break;
                    }

                }
            }
        }
    } catch (error) {
        console.log(`Error on disconnect:`);
        console.log(error);
    }

}