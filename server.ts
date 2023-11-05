import { getRoomsInfo } from "./utils/getRoomsInfo";
import {
  joinRoom,
  disconnect,
  leaveRoom,
  createRoom,
  sendMessage,
  startGameEvent,
  characterChoice,
  getMyRole,
  getMyDrawChoice,
  playBang,
  playBangAsCJ,
  playBangInDuel,
  playBangOnIndiani,
  playMancatoOnIndiani,
  playMancato,
  playMancatoAsCJ,
  playMancatoInDuel,
  playBeer,
  playSaloon,
  playEmporio,
  getEmporioCard,
  getChoiceCardKC,
  getChoiceCardLD,
  getStackCardPR,
  playDiligenza,
  playWellsfargo,
  playGatling,
  playIndiani,
  playDuel,
  playPrigione,
  playCatBallou,
  playCatBallouOnTableCard,
  playPanico,
  playPanicoOnTableCard,
  placeBlueCardOnTable,
  loseHealth,
  useBarel,
  useDynamite,
  usePrigione,
  jesseJonesTarget,
  drawFromDeck,
  jourdonnaisBarel,
  discard,
  endTurnEvent,
  requestPlayersInRange
} from "./events";
import { Rooms } from "./types/room";

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const parser = require("socket.io-msgpack-parser");
const ws = require('ws');
const path = require('path');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

const PORT = process.env.PORT || 3000;

const io = new Server(server,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    wsEngine: ws.Server,
    parser,
  }
);

export let rooms: Rooms = {};

io.on("connection", (socket: any) => {
  socket.emit("rooms", getRoomsInfo(rooms));

  socket.on("join_room", (data: any) => { joinRoom(socket, io, data) });

  socket.on("disconnect", () => { disconnect(socket, io) });

  socket.on("leave_room", (data: any) => { leaveRoom(socket, io, data) });

  socket.on("create_room", (roomName: string) => { createRoom(io, roomName) });

  socket.on("send_message", (data: any) => { sendMessage(io, data) })

  // ********** GAME LOGIC **********
  socket.on("start_game", (data: any) => { startGameEvent(io, data) });

  socket.on("character_choice", (data: any) => { characterChoice(io, data) });

  socket.on("get_my_role", (data: any) => { getMyRole(socket, data) });

  socket.on("play_bang", (data: any) => { playBang(io, data) });

  socket.on("play_bang_as_CJ", (data: any) => { playBangAsCJ(io, data) });

  socket.on("play_bang_in_duel", (data: any) => { playBangInDuel(io, data) });

  socket.on("play_bang_on_indiani", (data: any) => { playBangOnIndiani(io, data) });

  socket.on("play_mancato_on_indiani", (data: any) => { playMancatoOnIndiani(io, data) });

  socket.on("play_mancato", (data: any) => { playMancato(io, data) });

  socket.on("play_mancato_as_CJ", (data: any) => { playMancatoAsCJ(io, data) });

  socket.on("play_mancato_in_duel", (data: any) => { playMancatoInDuel(io, data) });

  socket.on("play_beer", (data: any) => { playBeer(io, data) });

  socket.on("play_saloon", (data: any) => { playSaloon(io, data) });

  socket.on("play_emporio", (data: any) => { playEmporio(io, data) });

  socket.on("get_emporio_card", (data: any) => { getEmporioCard(io, data) });

  socket.on("get_choice_card_KC", (data: any) => { getChoiceCardKC(io, data) });

  socket.on("get_choice_card_LD", (data: any) => { getChoiceCardLD(io, data) });

  socket.on("get_stack_card_PR", (data: any) => { getStackCardPR(io, data) });

  socket.on("play_diligenza", (data: any) => { playDiligenza(io, data) });

  socket.on("play_wellsfargo", (data: any) => { playWellsfargo(io, data) });

  socket.on("play_gatling", (data: any) => { playGatling(io, data) });

  socket.on("play_indiani", (data: any) => { playIndiani(io, data) });

  socket.on("play_duel", (data: any) => { playDuel(io, data) });

  socket.on("play_prigione", (data: any) => { playPrigione(io, data) });

  socket.on("play_cat_ballou", (data: any) => { playCatBallou(io, data) });

  socket.on("play_cat_ballou_on_table_card", (data: any) => { playCatBallouOnTableCard(io, data) });

  socket.on("play_panico", (data: any) => { playPanico(io, data) });

  socket.on("play_panico_on_table_card", (data: any) => { playPanicoOnTableCard(io, data) });

  socket.on("place_blue_card_on_table", (data: any) => { placeBlueCardOnTable(io, data) });

  socket.on("lose_health", (data: any) => { loseHealth(io, data) });

  socket.on("use_barel", (data: any) => { useBarel(io, data) });

  socket.on("use_dynamite", (data: any) => { useDynamite(io, data) });

  socket.on("use_prigione", (data: any) => { usePrigione(io, data) });

  socket.on("jesse_jones_target", (data: any) => { jesseJonesTarget(io, data) });

  socket.on("draw_from_deck", (data: any) => { drawFromDeck(io, data) });

  socket.on("jourdonnais_barel", (data: any) => { jourdonnaisBarel(io, data) });

  socket.on("discard", (data: any) => { discard(io, data) });

  socket.on("end_turn", (roomName: any) => { endTurnEvent(io, roomName) });

  socket.on("request_players_in_range", (data: any) => { requestPlayersInRange(socket, data) });
});

app.get('/status', (req: any, res: any) => {
  res.send('Server is running.')
})

// app.get("/*", function(req: any, res: any){

//   res.sendFile(
//       path.join(__dirname, "../Bang_online_client/build/index.html"),
//       function (err: any) {
//         if (err) {
//           res.status(500).send(err);
//         }
//       }
//     );

// })

server.listen(PORT, () => {
  console.log("listening @ ", PORT);
});
