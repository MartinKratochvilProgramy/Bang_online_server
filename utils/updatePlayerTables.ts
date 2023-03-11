import { rooms } from "../server";

interface Player {
    username: string;
    id: string;
}

export function updatePlayerTables(io: any, roomName: string) {
    for (let i = 0; i < rooms[roomName].players.length; i++) {
        const player: Player = rooms[roomName].players[i];
        io.to(roomName).emit("update_table", {
            username: player.username,
            table: rooms[roomName].game!.getPlayerTable(player.username)
        })
    }
}