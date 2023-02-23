import { rooms } from "../server";
import { Card } from "../types/types";
import { compareHands } from "../utils/compareHands";

export const getMyHand = (socket: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    try {
        const prevHand: Card[] = rooms[roomName].game.getPlayerPrevHand(username);
        const currentHand: Card[] = rooms[roomName].game.getPlayerHand(username);

        if (!compareHands(prevHand, currentHand) ||
            rooms[roomName].game.getNameOfCurrentTurnPlayer() === username ||
            rooms[roomName].game.duelActive ||
            rooms[roomName].game.indianiActive ||
            rooms[roomName].game.gatlingActive ||
            rooms[roomName].game.players[username].isLosingHealth
        ) {
            socket.emit("my_hand", currentHand);
            rooms[roomName].game.players[username].prevHand = [...currentHand]
        }

    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}