import { rooms } from "../server";

export const updateGameState = (io: any, roomName: any) => {
    try {
        io.to(roomName).emit("update_hands");
        io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
        io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
    } catch (error) {
        console.log(`Error on updateGameState():`);
        console.log(error);
    }
}