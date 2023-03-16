"use strict";
exports.__esModule = true;
exports.updateTopStackCard = void 0;
var server_1 = require("../server");
function updateTopStackCard(io, roomName) {
    // update topStackCard only if is different
    if (server_1.rooms[roomName].game === null)
        return;
    io.to(roomName).emit("update_top_stack_card", server_1.rooms[roomName].game.getTopStackCard());
}
exports.updateTopStackCard = updateTopStackCard;
