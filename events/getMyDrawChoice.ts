import { rooms } from "../server";

export const getMyDrawChoice = (socket: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        socket.emit("my_draw_choice", rooms[roomName].game.drawChoice);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}