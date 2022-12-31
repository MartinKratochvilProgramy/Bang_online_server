import { updateGameState } from "../utils";
import { rooms } from "../server";

export const getChoiceCardLD = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        rooms[roomName].game.getChoiceCardLD(data.username, data.card);
        updateGameState(io, roomName);
        io.to(roomName).emit("update_draw_choices", "Lucky Duke");
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}