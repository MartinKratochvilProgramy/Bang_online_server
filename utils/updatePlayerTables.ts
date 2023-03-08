import { rooms } from "../server";
import { Card } from "../types/types";
import { compareTables } from "./compareTables";

interface Player {
    username: string;
    id: string;
}

export function updatePlayerTables(io: any, roomName: string) {
    for (let i = 0; i < rooms[roomName].players.length; i++) {
        const player: Player = rooms[roomName].players[i];
        // TODO: this updates all player tables
        io.to(roomName).emit("update_table", {
            username: player.username,
            table: rooms[roomName].game!.getPlayerTable(player.username)
        })

        // emitTable(io, roomName, player);
    }
}

function emitTable(io: any, roomName: string, player: Player) {
    const prevTable: Card[] = rooms[roomName].game!.getPlayerPrevTable(player.username);
    const currentTable: Card[] = rooms[roomName].game!.getPlayerTable(player.username);

    console.log(prevTable, currentTable);


    if (!compareTables(prevTable, currentTable)) {
        console.log("true for", player);

        io.to(roomName).emit("update_table", {
            username: player.username,
            table: currentTable
        })
        rooms[roomName].game!.players[player.username].prevTable = [...currentTable]
    }
}