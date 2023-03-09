import { rooms } from "../server";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playBangAsCJ = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useBangAsCJ(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("update_players_losing_health", rooms[roomName].game!.getPlayersLosingHealth());

        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })
        updateTopStackCard(io, roomName);

        if (!rooms[roomName].game!.gatlingActive) {
            const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer();
            const currentPlayerID = rooms[roomName].players.find(player => player.username === currentPlayer)!.id;
            io.to(currentPlayerID).emit("my_hand", rooms[roomName].game!.getPlayerHand(currentPlayer));
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}