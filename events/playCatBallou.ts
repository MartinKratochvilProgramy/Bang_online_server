import { rooms } from "../server";
import { updateGameState } from "../utils/updateGameState";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playCatBallou = (io: any, data: any) => {
    const roomName = data.currentRoom;
    
    if (rooms[roomName].game === null) return;

    const username = rooms[roomName].game?.getNameOfCurrentTurnPlayer()!;
    const target = data.target;

    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useCatBallou(data.target, data.cardDigit, data.cardType));
        
        const userID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(userID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })
        
        const targetID = rooms[roomName].players.find(player => player.username === target)!.id;
        io.to(targetID).emit("my_hand", rooms[roomName].game!.getPlayerHand(target));
        io.to(roomName).emit("update_number_of_cards", {
            username: target,
            handSize: rooms[roomName].game!.getPlayerHand(target).length
        })

        console.log(userID, targetID);

        updateTopStackCard(io, roomName);

    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}