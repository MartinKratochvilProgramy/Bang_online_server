import { rooms } from "../server";
import { getRoomsInfo } from "../utils/getRoomsInfo";
import { updateGameState } from "../utils/updateGameState";
import { nextTurn } from "../utils/nextTurn";

export const leaveRoom = (socket: any, io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        // leave socket
        socket.leave(roomName);
        // remove player from players
        rooms[roomName].players.splice(rooms[roomName].players.indexOf(data.username), 1);
        io.to(roomName).emit("get_players", rooms[roomName].players);

        if (rooms[roomName].game === null) return;

        if (rooms[roomName].players.length <= 0) {
            // if room empty, delete it
            delete rooms[roomName];
            console.log(`Room ${roomName} deleted`)
            console.log("Existing rooms ", Object.keys(rooms));
            socket.emit("rooms", getRoomsInfo(rooms));
        } else {
            if (rooms[roomName].game !== null) {
                // if game exists
                // tell game a player left
                rooms[roomName].game!.removePlayer(data.username);
                // send info to client
                updateGameState(io, roomName);
                nextTurn(io, roomName);
                // if players left in game, emit to them
                io.to(roomName).emit("get_players", rooms[roomName].players);
            }
        }
        io.emit("rooms", getRoomsInfo(rooms));
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}