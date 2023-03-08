import { rooms } from "../server";

export const getMyDrawChoice = (socket: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        socket.emit("my_draw_choice", rooms[roomName].game!.drawChoice);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}