import { rooms } from "../server";
import { updateTopStackCard } from "../utils/updateTopStackCard";

export const getChoiceCardLD = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;

    try {
        rooms[roomName].game!.getChoiceCardLD(data.username, data.card);

        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })
        io.to(socketID).emit("update_draw_choices", "Lucky Duke");

        updateTopStackCard(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}