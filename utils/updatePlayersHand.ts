import { rooms } from "../server";

export function updatePlayersHand(io: any, roomName: string, username: string) {
    // emit hand to player username
    // emit hand-size change to roomName

    const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
    io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
    io.to(roomName).emit("update_number_of_cards", {
        username: username,
        handSize: rooms[roomName].game!.getPlayerHand(username).length
    })
}