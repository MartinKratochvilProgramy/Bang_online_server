"use strict";
exports.__esModule = true;
exports.compareHands = void 0;
var compareCards_1 = require("./compareCards");
function compareHands(hand1, hand2) {
    if (hand1.length !== hand2.length)
        return false;
    for (var i = 0; i < hand1.length; i++) {
        var card1 = hand1[i];
        var card2 = hand2[i];
        if (!(0, compareCards_1.compareCards)(card1, card2))
            return false;
    }
    return true;
}
exports.compareHands = compareHands;
