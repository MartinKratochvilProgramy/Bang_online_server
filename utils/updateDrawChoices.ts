import { rooms } from "../server";

export function updateDrawChoices(io: any, roomName: string, username: string) {
    if (rooms[roomName].game!.players[username].character.name === "Kit Carlson") {
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_draw_choice", rooms[roomName].game!.drawChoice);

    } else if (rooms[roomName].game!.players[username].character.name === "Lucky Duke") {
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_draw_choice", rooms[roomName].game!.drawChoice);

    } else if (rooms[roomName].game!.players[username].character.name === "Pedro Ramirez" && rooms[roomName].game!.stack.length > 0) {
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("update_draw_choices", "Pedro Ramirez");

    } else if (rooms[roomName].game!.players[username].character.name === "Jesse Jones") {
        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("update_draw_choices", "Jesse Jones");
    }
}