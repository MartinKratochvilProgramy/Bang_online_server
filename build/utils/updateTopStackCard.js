"use strict";
exports.__esModule = true;
exports.updateTopStackCard = void 0;
var server_1 = require("../server");
var compareCards_1 = require("./compareCards");
function updateTopStackCard(io, roomName) {
    // update topStackCard only if is different
    if (server_1.rooms[roomName].game === null)
        return;
    var prevTopStackCard = server_1.rooms[roomName].game.prevTopStackCard;
    var topStackCard = server_1.rooms[roomName].game.getTopStackCard();
    if (!(0, compareCards_1.compareCards)(topStackCard, prevTopStackCard)) {
        server_1.rooms[roomName].game.prevTopStackCard = topStackCard;
        io.to(roomName).emit("update_top_stack_card", topStackCard);
    }
}
exports.updateTopStackCard = updateTopStackCard;
