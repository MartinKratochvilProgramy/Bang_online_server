const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
var uuid = require('uuid');
const Game = require('./game.js');
const deck = require('./deck.js')
const ws = require('ws');

const PORT = process.env.PORT || 3001;

const io = new Server(server, 
  { cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    wsEngine: ws.Server,
  }
);

// app.use(cors());
// app.use(express.json());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

let rooms = {}

io.on("connection", (socket) => {
  socket.emit("rooms", getRoomsInfo());

  socket.on("join_room", (data) => {
    const roomName = data.currentRoom;
    try {
      socket.join(data.currentRoom);
  
      let username = data.username;
      // go through players, if player exists, add "_|" to username
      for (let i = 0; i < rooms[roomName].players.length; i++) {
        if (rooms[roomName].players[i].username === username) {
          username += "_|";
          socket.emit("username_changed", username);
          i = 0;
        }
      }
  
      const newUser = {
        username: username,
        id: socket.id
      };
      rooms[roomName].players.push(newUser);
  
      io.emit("rooms", getRoomsInfo());
      
      io.to(data.currentRoom).emit("get_players", rooms[roomName].players);
      io.to(data.currentRoom).emit("get_messages", rooms[roomName].messages);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  });

  socket.on("disconnect", () => {
    try {
      // user disconnected by closing the browser
      // search rooms for player
      for (var room of Object.keys(rooms)) {
        // iterate throught players inside room
        for (let i = 0; i < rooms[room].players.length; i++) {
          if (rooms[room].game === null) {
            // game not yet started in game -> simple splice
            if(rooms[room].players[i].id === socket.id) {
              rooms[room].players.splice(rooms[room].players.indexOf(rooms[room].players[i].username), 1);
              io.to(room).emit("get_players", rooms[room].players);
              io.emit("rooms", getRoomsInfo());
            }
  
          } else {
            // game exists
            // if player === player who disconnected, splice him
            if(rooms[room].players[i].id === socket.id) {
      
              io.to(room).emit("console", [`${rooms[room].players[i].username} disconnected`]);
              const message = rooms[room].game.removePlayer(rooms[room].players[i].username);
              
              // if game still active, check game-end
              // player dies when disconnecting, check game-end
              if (message[message.length - 1] === "Game ended") {
                // game over      
                // emit who won
                io.to(room).emit("game_ended", message[message.length - 2]);
                io.to(room).emit("console", [message[message.length - 2], message[message.length - 1]]);
              }
              io.to(room).emit("known_roles", rooms[room].game.knownRoles);
              
              rooms[room].players.splice(i, 1);
              io.emit("rooms", getRoomsInfo());
    
              // tell game a player left if room exists
              if (rooms[room].game && rooms[room].players.length >= 2) {
                // if game exists, remove player from game
                // send info to client
                updateGameState(io, room);
                nextTurn(io, room);
              }
              socket.emit("room_left");
              
    
              if(rooms[room].players.length <= 0) {
                // if room empty, delete it
                delete rooms[room];
                console.log("Room ", room, " deleted")
                console.log("Existing rooms ", Object.keys(rooms));
              } else {
                // if players left in game, emit to them
                io.to(room).emit("get_players", rooms[room].players);
                updateGameState(io, room);
              }
              break;
            }
    
          }
        }
      }
    } catch (error) {
        console.log(`Error on disconnect:`);
        console.log(error);
    }
  })

  socket.on("leave_room", data => {
    const roomName = data.currentRoom;
    try {
      // leave socket
      socket.leave(roomName);
      // remove player from players
      rooms[roomName].players.splice(rooms[roomName].players.indexOf(data.username), 1);
      io.to(roomName).emit("get_players", rooms[roomName].players);
  
      
      if(rooms[roomName].players.length <= 0) {
        // if room empty, delete it
        delete rooms[roomName];
        console.log("Room ", roomName, " deleted")
        console.log("Existing rooms ", Object.keys(rooms));
        socket.emit("rooms", getRoomsInfo()); 
      } else {
        if (rooms[roomName].game !== null) {
          // if game exists
          // tell game a player left
          rooms[roomName].game.removePlayer(data.username);
          // send info to client
          updateGameState(io, roomName);
          nextTurn(io, roomName);
          // if players left in game, emit to them
          io.to(roomName).emit("get_players", rooms[roomName].players);
        }
      }
      io.emit("rooms", getRoomsInfo());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  });

  socket.on("create_room", roomName => {
    try {
      rooms[roomName] = {
        players: [],
        messages: [],
        game: null
      };
  
      io.emit("rooms", getRoomsInfo());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("send_message", data => {
    const roomName = data.currentRoom;
    try {
      if (rooms[roomName].messages !== undefined) {
        rooms[roomName].messages.push({
          username: data.username,
          message: data.message,
          id: uuid.v4()
        })
      }
      io.to(roomName).emit("get_messages", rooms[roomName].messages);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  // ********** GAME LOGIC **********
  socket.on("start_game", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game = new Game(data.players, deck);
      console.log("Game started in room ", roomName);
      io.emit("rooms", getRoomsInfo());
  
      io.to(roomName).emit("get_character_choices", rooms[roomName].game.genCharacterChoices());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  });

  socket.on("character_choice", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game.setCharacter(data.username, data.character);
      
      if (rooms[roomName].game.getAllPlayersChoseCharacter()) {
        // if all char choices went through, start game
        rooms[roomName].game.initRoles();
        io.to(roomName).emit("known_roles", rooms[roomName].game.knownRoles)
        startGame(io, roomName);
      }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  });

  socket.on("get_my_role", data => {
    const roomName = data.currentRoom;
    try {
      socket.emit("my_role", rooms[roomName].game.players[data.username].character.role);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  });

  socket.on("get_my_hand", data => {
    const roomName = data.currentRoom;
    try {
      socket.emit("my_hand", rooms[roomName].game.getPlayerHand(data.username));
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  });

  socket.on("get_my_draw_choice", data => {
    const roomName = data.currentRoom;
    try {
      socket.emit("my_draw_choice", rooms[roomName].game.drawChoice);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  });

  socket.on("play_bang", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useBang(data.target, data.cardDigit, data.cardType, data.username));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
  
      if (rooms[roomName].game.players[data.target].character.name === "Jourdonnais") {
        io.to(roomName).emit("jourdonnais_can_use_barel");
      }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("play_bang_as_CJ", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useBangAsCJ(data.username, data.cardDigit, data.cardType));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_bang_in_duel", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useBangInDuel(data.cardDigit, data.cardType, data.username));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_bang_on_indiani", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useBangOnIndiani(data.cardDigit, data.cardType, data.username));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      io.to(roomName).emit("indiani_active", rooms[roomName].game.indianiActive);
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_mancato_on_indiani", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useMancatoOnIndiani(data.cardDigit, data.cardType, data.username));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      io.to(roomName).emit("indiani_active", rooms[roomName].game.indianiActive);
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("play_mancato", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useMancato(data.username, data.cardDigit, data.cardType));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_mancato_as_CJ", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useMancatoAsCJ(data.target, data.cardDigit, data.cardType, data.username));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_mancato_in_duel", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useMancatoInDuel(data.cardDigit, data.cardType, data.username));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_beer", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useBeer(data.username, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_saloon", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useSaloon(data.username, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_emporio", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useEmporio(data.username, data.cardDigit, data.cardType));
      // send emporio state to clients
      io.to(roomName).emit("emporio_state", {cards: rooms[roomName].game.emporio, nextEmporioTurn: rooms[roomName].game.nextEmporioTurn});
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("get_emporio_card", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game.getEmporioCard(data.username, data.card);
      // send emporio state to clients
      io.to(roomName).emit("emporio_state", {cards: rooms[roomName].game.emporio, nextEmporioTurn: rooms[roomName].game.nextEmporioTurn});
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("get_choice_card_KC", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game.getChoiceCardKC(data.username, data.card);
      updateGameState(io, roomName);
      io.to(roomName).emit("update_draw_choices", "Kit Carlson");
      io.to(roomName).emit("update_hands");
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("get_choice_card_LD", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game.getChoiceCardLD(data.username, data.card);
      updateGameState(io, roomName);
      io.to(roomName).emit("update_draw_choices", "Lucky Duke");
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("get_stack_card_PR", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game.getStackCardPR(data.username,);
      // send emporio state to clients
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("play_diligenza", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useDiligenza(data.username, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_wellsfargo", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useWellsFargo(data.username, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_gatling", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useGatling(data.username, data.cardDigit, data.cardType));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
  
      if (rooms[roomName].game.players[data.username].character.name === "Jourdonnais") return; // if Jourdonnais played Gatling, don't activate his Barel
      // search player characters, if there is Jourdonnais, let him use Barel
      for (const player of Object.keys(rooms[roomName].game.players)) {
        if (rooms[roomName].game.players[player].character.name === "Jourdonnais") {
          io.to(roomName).emit("jourdonnais_can_use_barel");
        }
      }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("play_indiani", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useIndiani(data.username, data.cardDigit, data.cardType));
      io.to(roomName).emit("indiani_active", rooms[roomName].game.indianiActive);
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_duel", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useDuel(data.target, data.cardDigit, data.cardType));
      io.to(roomName).emit("duel_active", rooms[roomName].game.duelActive);
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_prigione", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.playPrigione(data.target, data.activeCard));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_cat_ballou", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useCatBallou(data.target, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_cat_ballou_on_table_card", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useCatBallouOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_panico", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.usePanico(data.target, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("play_panico_on_table_card", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.usePanicoOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("place_blue_card_on_table", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.placeBlueCardOnTable(data.card));
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("lose_health", (data) => {
    const roomName = data.currentRoom;
    try {
      const message = rooms[roomName].game.loseHealth(data.username)
      io.to(roomName).emit("console", message);
      
      // player death -> show his role
      if (rooms[roomName].game.players[data.username].character.health <= 0) {
        io.to(roomName).emit("known_roles", rooms[roomName].game.knownRoles);
        updateGameState(io, roomName);
      }
      
      // on indiani, emit state
      io.to(roomName).emit("indiani_active", rooms[roomName].game.indianiActive);
      io.to(roomName).emit("duel_active", rooms[roomName].game.duelActive);  // this is not optimal, however fixing it would require creating loseHealthInDuel() method...
      
      io.to(roomName).emit("update_hands");
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
      
      if (message[message.length - 1] === "Game ended") {
        // game over      
        // emit who won
        io.to(roomName).emit("game_ended", message[message.length - 2]);
        console.log("Game ended in room ", roomName);
      }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("use_barel", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.useBarel(data.username));
      updateGameState(io, roomName);
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("use_dynamite", (data) => {
    const roomName = data.currentRoom;
    try {
      const message = rooms[roomName].game.useDynamite(data.username, data.card);
      io.to(roomName).emit("console", message);
  
      updateGameState(io, roomName);
  
      if (message[message.length - 1] === "Game ended") {
        // game over      
        // emit who won
        io.to(roomName).emit("game_ended", message[message.length - 2]);
        console.log("Game ended in room ", roomName);
        return;
      }
      if (rooms[roomName].game.players[data.username].character.health <= 0) {
        endTurn(io, roomName);
        return;
      }
      io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
  
      const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer();
      if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
        io.to(roomName).emit("update_draw_choices", "Kit Carlson");
    
      } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
        io.to(roomName).emit("update_draw_choices", "Lucky Duke");
    
      } else if (rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game.stack.length > 0) {
        io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");
  
      } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
        io.to(roomName).emit("update_draw_choices", "Jesse Jones");
      }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("use_prigione", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.usePrigione(data.username, data.card));
      updateGameState(io, roomName);
      io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
      
      const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer();
      io.to(roomName).emit("current_player", currentPlayer);
  
      if (rooms[roomName].game.getPlayerIsInPrison(currentPlayer) || rooms[roomName].game.getPlayerHasDynamite(currentPlayer)) return;
  
      if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
        io.to(roomName).emit("update_draw_choices", "Kit Carlson");
    
      } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
        io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  
      } else if (rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game.stack.length > 0) {
        io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");
    
      } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
        io.to(roomName).emit("update_draw_choices", "Jesse Jones");
      }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
    
  socket.on("jesse_jones_target", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game.jesseJonesTarget(data.target);
      updateGameState(io, roomName);
      io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
    
  socket.on("draw_from_deck", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.drawFromDeck(2, data.username));
      updateGameState(io, roomName);
      io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
  
  socket.on("jourdonnais_barel", (data) => {
    const roomName = data.currentRoom;
    try {
      io.to(roomName).emit("console", rooms[roomName].game.jourdonnaisBarel(data.username));
      io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
      updateGameState(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("discard", (data) => {
    const roomName = data.currentRoom;
    try {
      rooms[roomName].game.discard(data.card.name, data.card.digit, data.card.type, data.username);
      if (rooms[roomName].game.players[data.username].hand.length <= rooms[roomName].game.players[data.username].character.health) {
        // special case for when SK is discarding
        if (rooms[roomName].game.players[data.username].character.name !== "Sid Ketchum") {
          // if less of equal cards in hand -> endTurn
          socket.emit("end_discard");
          endTurn(io, roomName);
        } else {
          updateGameState(io, roomName)
        }
      } else {
        updateGameState(io, roomName)
      }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("end_turn", (roomName) => {
    try {
      endTurn(io, roomName);
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })

  socket.on("request_players_in_range", (data) => {
    const roomName = data.currentRoom;
    try {
      socket.emit("players_in_range", rooms[roomName].game.getPlayersInRange(data.username, data.range))
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }
  })
});

server.listen(PORT, () => {
  console.log("listening @ ", PORT);
});


function updateGameState(io, roomName) {
  try {
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  } catch (error) {
      console.log(`Error on updateGameState():`);
      console.log(error);
  }
}

function endTurn(io, roomName) {
  try {
    io.to(roomName).emit("console", rooms[roomName].game.endTurn());
  
    const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
    
    io.to(roomName).emit("current_player", currentPlayer);
    io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
    updateGameState(io, roomName)
  
    if (rooms[roomName].game.getPlayerIsInPrison(currentPlayer)) return;
    if (rooms[roomName].game.getPlayerHasDynamite(currentPlayer)) return;
    
    if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
      io.to(roomName).emit("update_draw_choices", "Kit Carlson");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
      io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game.stack.length > 0) {
      io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");
    
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
      io.to(roomName).emit("update_draw_choices", "Jesse Jones");
    }
  } catch (error) {
      console.log(`Error on endTurn():`);
      console.log(error);
  }
}

function nextTurn(io, roomName) {
  try {
    const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
    
    if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
      io.to(roomName).emit("update_draw_choices", "Kit Carlson");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
      io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Pedro Ramirez" && rooms[roomName].game.stack.length > 0) {
      io.to(roomName).emit("update_draw_choices", "Pedro Ramirez");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
      io.to(roomName).emit("update_draw_choices", "Jesse Jones");
    }
  
    io.to(roomName).emit("current_player", currentPlayer);
    io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
    updateGameState(io, roomName);
  } catch (error) {
      console.log(`Error on nextTurn():`);
      console.log(error);
  }
}

function getRoomsInfo() {
  try {
    // return all rooms in an array
    // [{roomName, numOfPlayers, gameActive}]
    const res = []
    for (const room of Object.keys(rooms)) {
      const roomInfo = {
        name: room,
        numOfPlayers: rooms[room].players.length,
        gameActive: rooms[room].game === null ? false : true
      }
      res.push(roomInfo);
    }
    return res;
  } catch (error) {
      console.log(`Error on getRoomsInfo():`);
      console.log(error);
  }
}

function startGame(io, roomName) {
  try {
    io.to(roomName).emit("console", rooms[roomName].game.startGame());
  
    let characters = []
    for (var player of Object.keys(rooms[roomName].game.players)) {
      characters.push({playerName: player, character: rooms[roomName].game.players[player].character.name})
    }
    io.to(roomName).emit("characters", characters);
    io.to(roomName).emit("current_player", rooms[roomName].game.getNameOfCurrentTurnPlayer());
    io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());
    
    const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
  
    if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
      io.to(roomName).emit("update_draw_choices", "Kit Carlson");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
      io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
      io.to(roomName).emit("update_draw_choices", "Jesse Jones");
  
    }
  
    io.to(roomName).emit("game_started", {allPlayersInfo: rooms[roomName].game.getAllPlayersInfo(), allCharactersInfo: rooms[roomName].game.getCharacters()});
  } catch (error) {
      console.log(`Error on startGame():`);
      console.log(error);
  }
}