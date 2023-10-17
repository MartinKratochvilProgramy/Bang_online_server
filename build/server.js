"use strict";
exports.__esModule = true;
exports.rooms = void 0;
var getRoomsInfo_1 = require("./utils/getRoomsInfo");
var events_1 = require("./events");
var express = require("express");
var app = express();
var http = require("http");
var Server = require("socket.io").Server;
var server = http.createServer(app);
var parser = require("socket.io-msgpack-parser");
var ws = require('ws');
var path = require('path');
require('dotenv').config();
var _dirname = path.dirname("");
var buildPath = path.join(_dirname, "../Bang_online_client/build");
app.use(express.static(buildPath));
var PORT = process.env.PORT || 5001;
var io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    wsEngine: ws.Server,
    parser: parser
});
exports.rooms = {};
io.on("connection", function (socket) {
    socket.emit("rooms", (0, getRoomsInfo_1.getRoomsInfo)(exports.rooms));
    socket.on("join_room", function (data) { (0, events_1.joinRoom)(socket, io, data); });
    socket.on("disconnect", function () { (0, events_1.disconnect)(socket, io); });
    socket.on("leave_room", function (data) { (0, events_1.leaveRoom)(socket, io, data); });
    socket.on("create_room", function (roomName) { (0, events_1.createRoom)(io, roomName); });
    socket.on("send_message", function (data) { (0, events_1.sendMessage)(io, data); });
    // ********** GAME LOGIC **********
    socket.on("start_game", function (data) { (0, events_1.startGameEvent)(io, data); });
    socket.on("character_choice", function (data) { (0, events_1.characterChoice)(io, data); });
    socket.on("get_my_role", function (data) { (0, events_1.getMyRole)(socket, data); });
    socket.on("play_bang", function (data) { (0, events_1.playBang)(io, data); });
    socket.on("play_bang_as_CJ", function (data) { (0, events_1.playBangAsCJ)(io, data); });
    socket.on("play_bang_in_duel", function (data) { (0, events_1.playBangInDuel)(io, data); });
    socket.on("play_bang_on_indiani", function (data) { (0, events_1.playBangOnIndiani)(io, data); });
    socket.on("play_mancato_on_indiani", function (data) { (0, events_1.playMancatoOnIndiani)(io, data); });
    socket.on("play_mancato", function (data) { (0, events_1.playMancato)(io, data); });
    socket.on("play_mancato_as_CJ", function (data) { (0, events_1.playMancatoAsCJ)(io, data); });
    socket.on("play_mancato_in_duel", function (data) { (0, events_1.playMancatoInDuel)(io, data); });
    socket.on("play_beer", function (data) { (0, events_1.playBeer)(io, data); });
    socket.on("play_saloon", function (data) { (0, events_1.playSaloon)(io, data); });
    socket.on("play_emporio", function (data) { (0, events_1.playEmporio)(io, data); });
    socket.on("get_emporio_card", function (data) { (0, events_1.getEmporioCard)(io, data); });
    socket.on("get_choice_card_KC", function (data) { (0, events_1.getChoiceCardKC)(io, data); });
    socket.on("get_choice_card_LD", function (data) { (0, events_1.getChoiceCardLD)(io, data); });
    socket.on("get_stack_card_PR", function (data) { (0, events_1.getStackCardPR)(io, data); });
    socket.on("play_diligenza", function (data) { (0, events_1.playDiligenza)(io, data); });
    socket.on("play_wellsfargo", function (data) { (0, events_1.playWellsfargo)(io, data); });
    socket.on("play_gatling", function (data) { (0, events_1.playGatling)(io, data); });
    socket.on("play_indiani", function (data) { (0, events_1.playIndiani)(io, data); });
    socket.on("play_duel", function (data) { (0, events_1.playDuel)(io, data); });
    socket.on("play_prigione", function (data) { (0, events_1.playPrigione)(io, data); });
    socket.on("play_cat_ballou", function (data) { (0, events_1.playCatBallou)(io, data); });
    socket.on("play_cat_ballou_on_table_card", function (data) { (0, events_1.playCatBallouOnTableCard)(io, data); });
    socket.on("play_panico", function (data) { (0, events_1.playPanico)(io, data); });
    socket.on("play_panico_on_table_card", function (data) { (0, events_1.playPanicoOnTableCard)(io, data); });
    socket.on("place_blue_card_on_table", function (data) { (0, events_1.placeBlueCardOnTable)(io, data); });
    socket.on("lose_health", function (data) { (0, events_1.loseHealth)(io, data); });
    socket.on("use_barel", function (data) { (0, events_1.useBarel)(io, data); });
    socket.on("use_dynamite", function (data) { (0, events_1.useDynamite)(io, data); });
    socket.on("use_prigione", function (data) { (0, events_1.usePrigione)(io, data); });
    socket.on("jesse_jones_target", function (data) { (0, events_1.jesseJonesTarget)(io, data); });
    socket.on("draw_from_deck", function (data) { (0, events_1.drawFromDeck)(io, data); });
    socket.on("jourdonnais_barel", function (data) { (0, events_1.jourdonnaisBarel)(io, data); });
    socket.on("discard", function (data) { (0, events_1.discard)(io, data); });
    socket.on("end_turn", function (roomName) { (0, events_1.endTurnEvent)(io, roomName); });
    socket.on("request_players_in_range", function (data) { (0, events_1.requestPlayersInRange)(socket, data); });
});
app.get('/status', function (req, res) {
    res.send('Server is running.');
});
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../Bang_online_client/build/index.html"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});
server.listen(PORT, function () {
    console.log("listening @ ", PORT);
});
