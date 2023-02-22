"use strict";
exports.__esModule = true;
exports.endTurnEvent = void 0;
var utils_1 = require("../utils");
var endTurnEvent = function (io, roomName) {
    try {
        (0, utils_1.endTurn)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.endTurnEvent = endTurnEvent;
