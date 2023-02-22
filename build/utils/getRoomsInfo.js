"use strict";
exports.__esModule = true;
exports.getRoomsInfo = void 0;
var getRoomsInfo = function (rooms) {
    try {
        // return all rooms in an array
        // [{roomName, numOfPlayers, gameActive}]
        var res = [];
        for (var _i = 0, _a = Object.keys(rooms); _i < _a.length; _i++) {
            var room = _a[_i];
            if (rooms[room].players.length > 0) {
                var roomInfo = {
                    name: room,
                    numOfPlayers: rooms[room].players.length,
                    gameActive: rooms[room].game === null ? false : true
                };
                res.push(roomInfo);
            }
        }
        return res;
    }
    catch (error) {
        console.log("Error on getRoomsInfo():");
        console.log(error);
    }
};
exports.getRoomsInfo = getRoomsInfo;
