import { getRoomsInfo } from "../utils";
import { rooms } from "../server";

export const createRoom = (io: any, roomName: string) => {
    try {
        rooms[roomName] = {
            players: [],
            messages: [],
            game: null
        };

        io.emit("rooms", getRoomsInfo(rooms));
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}