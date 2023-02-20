import { RoomInfo } from "../types/types";

export const getRoomsInfo = (rooms: any) => {
    try {
        // return all rooms in an array
        // [{roomName, numOfPlayers, gameActive}]
        const res: RoomInfo[] = []
        for (const room of Object.keys(rooms)) {
            const roomInfo = {
                name: room,
                numOfPlayers: rooms[room].players.length,
                gameActive: rooms[room].game === null ? false : true
            }
            res.push(roomInfo);
        }
        return res;
    } catch (error) {
        console.log(`Error on getRoomsInfo():`);
        console.log(error);
    }
}