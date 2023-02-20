import { endTurn } from "../utils";
import { rooms } from "../server";

export const endTurnEvent = (io: any, roomName: any) => {
    try {
        endTurn(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}