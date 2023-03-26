"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.testPanicoDeck = void 0;
var P1_D1 = [
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        "class": "barel",
        isPlayable: false
    },
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 2,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 3,
        type: "diamonds",
        isPlayable: false
    },
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 4,
        type: "spades",
        isPlayable: false
    },
];
var P2_D1 = [
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 5,
        type: "hearts",
        "class": "barel",
        isPlayable: false
    },
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 6,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 7,
        type: "diamonds",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 8,
        type: "spades",
        isPlayable: false
    },
];
var P1_D2 = [
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 9,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 10,
        type: "clubs",
        isPlayable: false
    },
];
var P2_D2 = [
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 11,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 12,
        type: "hearts",
        "class": "barel",
        isPlayable: false
    },
];
exports.testPanicoDeck = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], P1_D1, true), P2_D1, true), P1_D2, true), P2_D2, true), P1_D1, true), P2_D1, true), P1_D2, true), P2_D2, true);
