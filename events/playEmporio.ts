import { rooms } from "../server";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const playEmporio = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.useEmporio(data.username, data.cardDigit, data.cardType));
        io.to(roomName).emit("emporio_state", { cards: rooms[roomName].game!.emporio, nextEmporioTurn: rooms[roomName].game!.nextEmporioTurn });

        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}