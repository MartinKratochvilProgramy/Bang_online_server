import { rooms } from "../server";
var uuid = require('uuid');

export const sendMessage = (io: any, data: any,) => {
    const roomName = data.currentRoom;
    try {
        if (rooms[roomName].messages !== undefined) {
            rooms[roomName].messages.push({
                username: data.username,
                message: data.message,
            })
        }
        io.to(roomName).emit("get_messages", rooms[roomName].messages);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}