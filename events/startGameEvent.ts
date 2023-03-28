import { rooms } from "../server";
import { Game } from "../game";
import { deck } from "../deck";
import { getRoomsInfo } from "../utils/getRoomsInfo";
import { testBangDeck } from "../testDecks/testBangDeck";
import { testIndianiDeck } from "../testDecks/testIndianiDeck";
import { testPanicoDeck } from "../testDecks/testPanicoDeck";
import { testPrigioneDeck } from "../testDecks/testPrigioneDeck";
import { testEmporioDeck } from "../testDecks/testEmporioDeck";
import { testStKDeck } from "../testDecks/testStKDeck";
import { testBJElGDeck } from "../testDecks/testBJElGDeck";
import { testDistancesDeck } from "../testDecks/testDistancesDeck";

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
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_EMPORIO)) {
                console.log("test Emporio");
                rooms[roomName].game = new Game(data.players, testEmporioDeck);
                rooms[roomName].game!.namesOfCharacters = ["Kit Carlson", "Vulture Sam", "Lucky Duke", "Rose Doolan"]
            }
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_BART_CASSIDY)) {
                console.log("test Emporio");
                rooms[roomName].game = new Game(data.players, testStKDeck);
                rooms[roomName].game!.namesOfCharacters = ["Slab the Killer", "Vulture Sam", "Bart Cassidy", "Rose Doolan"]
            }
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_BJ_ElG)) {
                console.log("test Emporio");
                rooms[roomName].game = new Game(data.players, testBJElGDeck);
                rooms[roomName].game!.namesOfCharacters = ["Black Jack", "Vulture Sam", "El Gringo", "Rose Doolan"]
            }
            if (rooms[roomName].players.some(player => player.username === process.env.TEST_DISTANCES)) {
                console.log("test Emporio");
                rooms[roomName].game = new Game(data.players, testDistancesDeck);
                rooms[roomName].game!.namesOfCharacters = [
                    "Rose Doolan", "Calamity Janet", 
                    "Paul Regret", "Rose Doolan",
                    "Willy the Kid", "Rose Doolan",
                    "Vulture Sam", "Rose Doolan",
                    ]
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