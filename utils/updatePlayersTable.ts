import { rooms } from "../server";


export function updatePlayersTable(io: any, roomName: string, username: string) {
    io.to(roomName).emit("update_table", {
        username: username,
        table: rooms[roomName].game!.getPlayerTable(username)
    })
}