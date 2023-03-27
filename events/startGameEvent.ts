import { rooms } from "../server";
import { Game } from "../game";
import { deck } from "../deck";
import { getRoomsInfo } from "../utils/getRoomsInfo";
import { testBangDeck } from "../testDecks/testBangDeck";
import { testIndianiDeck } from "../testDecks/testIndianiDeck";
import { testPanicoDeck } from "../testDecks/testPanicoDeck";
import { testPrigioneDeck } from "../testDecks/testPrigioneDeck";

export const startGameEvent = (io: any, data: any) => {
    const roomName = data.currentRoom;
    try {
        if (process.env.TEST_BANG !== undefined) {
            // load testing deck
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_BANG)) {
                console.log("test Bang");
                rooms[roomName].game = new Game(data.players, testBangDeck);
                rooms[roomName].game!.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Willy the Kid", "Rose Doolan"]
            }
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_INDIANI)) {
                console.log("test Indiani");
                rooms[roomName].game = new Game(data.players, testIndianiDeck);
                rooms[roomName].game!.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Jourdonnais", "Rose Doolan"]
            }
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_PANICO)) {
                console.log("test Panico");
                rooms[roomName].game = new Game(data.players, testPanicoDeck);
                rooms[roomName].game!.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Jourdonnais", "Rose Doolan"]
            }
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_PRIGIONE)) {
                console.log("test Prigione");
                rooms[roomName].game = new Game(data.players, testPrigioneDeck);
                rooms[roomName].game!.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Jesse Jones", "Rose Doolan"]
            }

        } else {
            rooms[roomName].game = new Game(data.players, deck);
        }
        console.log("Game started in room ", roomName, data.players);
        io.emit("rooms", getRoomsInfo(rooms));

        io.to(roomName).emit("get_character_choices", rooms[roomName].game!.genCharacterChoices());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}