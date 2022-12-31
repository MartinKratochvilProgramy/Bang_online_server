import { rooms } from "../server";

export const getMyRole = (socket: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        socket.emit("my_role", rooms[roomName].game.players[data.username].character.role);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}