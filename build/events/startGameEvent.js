"use strict";
exports.__esModule = true;
exports.startGameEvent = void 0;
var server_1 = require("../server");
var game_1 = require("../game");
var deck_1 = require("../deck");
var getRoomsInfo_1 = require("../utils/getRoomsInfo");
var testBangDeck_1 = require("../testDecks/testBangDeck");
var testIndianiDeck_1 = require("../testDecks/testIndianiDeck");
var testPanicoDeck_1 = require("../testDecks/testPanicoDeck");
var testPrigioneDeck_1 = require("../testDecks/testPrigioneDeck");
var testEmporioDeck_1 = require("../testDecks/testEmporioDeck");
var testStKDeck_1 = require("../testDecks/testStKDeck");
var testBJElGDeck_1 = require("../testDecks/testBJElGDeck");
var testDistancesDeck_1 = require("../testDecks/testDistancesDeck");
var startGameEvent = function (io, data) {
    var roomName = data.currentRoom;
    try {
        if (process.env.TEST_BANG !== undefined) {
            // load testing deck
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_BANG; })) {
                console.log("test Bang");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testBangDeck_1.testBangDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Willy the Kid", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_INDIANI; })) {
                console.log("test Indiani");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testIndianiDeck_1.testIndianiDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Jourdonnais", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_PANICO; })) {
                console.log("test Panico");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testPanicoDeck_1.testPanicoDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Jourdonnais", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_PRIGIONE; })) {
                console.log("test Prigione");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testPrigioneDeck_1.testPrigioneDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Calamity Janet", "Vulture Sam", "Jesse Jones", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_EMPORIO; })) {
                console.log("test Emporio");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testEmporioDeck_1.testEmporioDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Kit Carlson", "Vulture Sam", "Lucky Duke", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_STK; })) {
                console.log("test StK");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testStKDeck_1.testStKDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Slab the Killer", "Vulture Sam", "Jourdonnais", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_BART_CASSIDY; })) {
                console.log("test Bart Cassidy");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testStKDeck_1.testStKDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Slab the Killer", "Vulture Sam", "Bart Cassidy", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_BJ_ElG; })) {
                console.log("test BJ ElG");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testBJElGDeck_1.testBJElGDeck);
                server_1.rooms[roomName].game.namesOfCharacters = ["Black Jack", "Vulture Sam", "El Gringo", "Rose Doolan"];
            }
            if (server_1.rooms[roomName].players.some(function (player) { return player.username === process.env.TEST_DISTANCES; })) {
                console.log("test Distance");
                server_1.rooms[roomName].game = new game_1.Game(data.players, testDistancesDeck_1.testDistancesDeck);
                server_1.rooms[roomName].game.namesOfCharacters = [
                    "Rose Doolan", "Calamity Janet",
                    "Paul Regret", "Rose Doolan",
                    "Willy the Kid", "Rose Doolan",
                    "Vulture Sam", "Rose Doolan",
                ];
            }
        }
        else {
            server_1.rooms[roomName].game = new game_1.Game(data.players, deck_1.deck);
        }
        console.log("Game started in room ", roomName, data.players);
        io.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(server_1.rooms));
        io.to(roomName).emit("get_character_choices", server_1.rooms[roomName].game.genCharacterChoices());
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.startGameEvent = startGameEvent;
