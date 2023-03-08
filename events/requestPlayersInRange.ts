import { rooms } from "../server";

export const requestPlayersInRange = (socket: any, data: any) => {
    const roomName = data.currentRoom;
    if (rooms[roomName].game === null) return;
    try {
        socket.emit("players_in_range", rooms[roomName].game!.getPlayersInRange(data.username, data.range))
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}