"use strict";
exports.__esModule = true;
exports.compareCards = void 0;
function compareCards(car1, card2) {
    if (car1 === undefined || card2 === undefined)
        return false;
    if (car1.name === card2.name &&
        car1.digit === card2.digit &&
        car1.type === card2.type &&
        car1.isPlayable === card2.isPlayable) {
        return true;
    }
    else {
        return false;
    }
}
exports.compareCards = compareCards;
