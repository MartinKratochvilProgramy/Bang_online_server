import { rooms } from "../server";

export const jesseJonesTarget = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;
    const target = data.target;

    if (rooms[roomName].game === null) return;
    try {
        io.to(roomName).emit("console", rooms[roomName].game!.jesseJonesTarget(target));

        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
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

        io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game!.getPlayersWithActionRequired());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}