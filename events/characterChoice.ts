import { startGame } from "../utils/startGame";
import { rooms } from "../server";

export const characterChoice = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        if (rooms[roomName].game === null) return;
        rooms[roomName].game!.setCharacter(data.username, data.character);

        if (rooms[roomName].game!.getAllPlayersChoseCharacter()) {
            // if all char choices went through, start game
            rooms[roomName].game!.initRoles();
            io.to(roomName).emit("known_roles", rooms[roomName].game!.knownRoles)

            startGame(io, roomName);
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}