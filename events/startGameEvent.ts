import { rooms } from "../server";
import { Game } from "../game";
import { deck } from "../deck";
import { getRoomsInfo } from "../utils/getRoomsInfo";
import { deckDynamite } from "../testDecks/deckDynamite";

export const startGameEvent = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        rooms[roomName].game = new Game(data.players, deckDynamite);
        console.log("Game started in room ", roomName, data.players);
        io.emit("rooms", getRoomsInfo(rooms));

        io.to(roomName).emit("get_character_choices", rooms[roomName].game!.genCharacterChoices());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}