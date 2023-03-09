"use strict";
exports.__esModule = true;
exports.endTurnEvent = void 0;
var endTurn_1 = require("../utils/endTurn");
var endTurnEvent = function (io, roomName) {
    try {
        (0, endTurn_1.endTurn)(io, roomName);
    }
    catch (error) {
        console.log("Error in room ".concat(roomName, ":"));
        console.log(error);
    }
};
exports.endTurnEvent = endTurnEvent;
