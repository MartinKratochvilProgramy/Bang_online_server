"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.startGame = exports.endTurn = exports.nextTurn = exports.updateGameState = exports.getRoomsInfo = void 0;
var getRoomsInfo_1 = require("./getRoomsInfo");
__createBinding(exports, getRoomsInfo_1, "getRoomsInfo");
var updateGameState_1 = require("./updateGameState");
__createBinding(exports, updateGameState_1, "updateGameState");
var nextTurn_1 = require("./nextTurn");
__createBinding(exports, nextTurn_1, "nextTurn");
var endTurn_1 = require("./endTurn");
__createBinding(exports, endTurn_1, "endTurn");
var startGame_1 = require("./startGame");
__createBinding(exports, startGame_1, "startGame");
