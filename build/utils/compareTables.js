"use strict";
exports.__esModule = true;
exports.compareTables = void 0;
var compareCards_1 = require("./compareCards");
function compareTables(table1, table2) {
    if (table1.length !== table2.length)
        return false;
    for (var i = 0; i < table1.length; i++) {
        var card1 = table1[i];
        var card2 = table2[i];
        if (!(0, compareCards_1.compareCards)(card1, card2))
            return false;
    }
    return true;
}
exports.compareTables = compareTables;
