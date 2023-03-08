import { rooms } from "../server";
import { Player } from "../types/player";
import { Card } from "../types/types";
import { compareHands } from "./compareHands";

export function updatePlayerHands(io: any, roomName: string) {
    for (let i = 0; i < rooms[roomName].players.length; i++) {
        const player: Player = rooms[roomName].players[i];
        emitHandToSocket(io, roomName, player);
    }
}

function emitHandToSocket(io: any, roomName: string, player: Player) {
    const prevHand: Card[] = rooms[roomName].game.getPlayerPrevHand(player.username);
    const currentHand: Card[] = rooms[roomName].game.getPlayerHand(player.username);

    if (!compareHands(prevHand, currentHand) ||
        rooms[roomName].game.getNameOfCurrentTurnPlayer() === player.username ||
        rooms[roomName].game.duelActive ||
        rooms[roomName].game.indianiActive ||
        rooms[roomName].game.gatlingActive ||
        rooms[roomName].game.players[player.username].isLosingHealth
    ) {
        io.to(player.id).emit("my_hand", currentHand)
        io.to(roomName).emit("update_number_of_cards", {
            username: player.username,
            handSize: currentHand.length
        })
        rooms[roomName].game.players[player.username].prevHand = [...currentHand]
    }
}