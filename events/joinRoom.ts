import { getRoomsInfo } from "../utils/getRoomsInfo";
import { rooms } from "../server";

export const joinRoom = (socket: any, io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        socket.join(data.currentRoom);

        let username = data.username;
        // go through players, if player exists, add "_|" to username
        for (let i = 0; i < rooms[roomName].players.length; i++) {
            if (rooms[roomName].players[i].username === username) {
                username += "_|";
                socket.emit("username_changed", username);
                i = 0;
            }
        }

        const newUser = {
            username: username,
            id: socket.id
        };
        rooms[roomName].players.push(newUser);

        io.emit("rooms", getRoomsInfo(rooms));

        io.to(data.currentRoom).emit("get_players", rooms[roomName].players);
        io.to(data.currentRoom).emit("get_messages", rooms[roomName].messages);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
}