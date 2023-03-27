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
exports.testPrigioneDeck = void 0;
var P1_D1 = [
    {
        name: "Prigione",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        "class": "barel",
        isPlayable: false
    },
    {
        name: "Prigione",
        rimColor: "blue",
        digit: 2,
        type: "hearts",
        "class": "barel",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 3,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 4,
        type: "spades",
        "class": "dynamite",
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
        name: "Dynamite",
        rimColor: "blue",
        digit: 6,
        type: "hearts",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 7,
        type: "hearts",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 8,
        type: "hearts",
        "class": "dynamite",
        isPlayable: false
    },
];
var P1_D2 = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 9,
        type: "hearts",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        "class": "dynamite",
        isPlayable: false
    },
];
var prison_D1 = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        "class": "dynamite",
        isPlayable: false
    }
];
var prison_D2 = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 11,
        type: "hearts",
        "class": "dynamite",
        isPlayable: false
    }
];
var restOfTheDeck = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 6,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 13,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 14,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 15,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 16,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 17,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 18,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 19,
        type: "spades",
        "class": "dynamite",
        isPlayable: false
    },
];
exports.testPrigioneDeck = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], P1_D1, true), P2_D1, true), P1_D2, true), prison_D1, true), prison_D2, true), P1_D1, true), restOfTheDeck, true), restOfTheDeck, true);
