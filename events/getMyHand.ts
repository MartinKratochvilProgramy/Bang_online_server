import { rooms } from "../server";

export const getMyHand = (socket: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        socket.emit("my_hand", rooms[roomName].game.getPlayerHand(data.username));
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}