import { updateGameState } from "../utils";
import { rooms } from "../server";

export const getStackCardPR = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        rooms[roomName].game.getStackCardPR(data.username,);
        // send emporio state to clients
        updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}