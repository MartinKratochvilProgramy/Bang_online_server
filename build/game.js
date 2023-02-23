"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game(playerNames, deck) {
        this.playerNames = playerNames;
        this.numOfPlayers = this.playerNames.length;
        this.namesOfCharacters = ["Bart Cassidy", "Black Jack", "Calamity Janet", "El Gringo", "Jesse Jones", "Jourdonnais", "Kit Carlson", "Lucky Duke", "Paul Regret", "Pedro Ramirez", "Rose Doolan", "Slab the Killer", "Suzy Lafayette", "Vulture Sam", "Willy the Kid"];
        // this.namesOfCharacters = ["Jesse Jones", "Calamity Janet", "Lucky Duke", "Kit Carlson"]
        this.knownRoles = {};
        this.deck = __spreadArray([], deck, true); // create new copy of deck
        this.gameEnded = false;
        this.stack = [];
        this.emporio = [];
        this.drawChoice = [];
        this.players = {};
        this.playerRoundId = 0;
        this.bangCanBeUsed = true;
        this.duelActive = false;
        this.indianiActive = false;
        this.gatlingActive = false;
        this.duelPlayers = [];
        this.duelTurnIndex = 0;
        this.luckyDukeFirstDraw = true;
        this.sidKetchumDiscarded = false;
        this.awaitDrawChoice = false;
        this.nextEmporioTurn = null;
        // init players
        for (var i = 0; i < this.numOfPlayers; i++) {
            this.players[playerNames[i]] = {
                id: i,
                hand: [],
                table: [],
                isLosingHealth: false,
                mancatoPool: 0,
                character: {
                    name: null,
                    role: null
                }
            };
        }
    }
    Game.prototype.draw = function (numToDraw, playerName) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        if (this.deck.length <= 8) {
            this.putStackIntoDeck();
        }
        for (var i = 0; i < numToDraw; i++) {
            // if no cards in deck, put stack into deck
            if (this.deck.length <= 0)
                this.putStackIntoDeck();
            var card = this.deck[0];
            card.isPlayable = false;
            this.players[playerName].hand.push(card);
            this.deck.shift();
        }
        if (numToDraw === 1) {
            return "".concat(playerName, " drew ").concat(numToDraw, " card");
        }
        else {
            return "".concat(playerName, " drew ").concat(numToDraw, " cards");
        }
    };
    Game.prototype.drawFromDeck = function (numToDraw, playerName) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        if (this.deck.length <= 0) {
            this.putStackIntoDeck();
        }
        for (var i = 0; i < numToDraw; i++) {
            // if no cards in deck, put stack into deck
            if (this.deck.length === 0)
                this.putStackIntoDeck();
            var card = this.deck[0];
            this.players[playerName].hand.push(card);
            this.deck.shift();
        }
        this.setAllPlayable(playerName);
        if (this.players[playerName].character.name === "Jesse Jones" || this.players[playerName].character.name === "Pedro Ramirez") {
            this.awaitDrawChoice = false;
        }
        if (numToDraw === 1) {
            return ["".concat(playerName, " drew ").concat(numToDraw, " card")];
        }
        else {
            return ["".concat(playerName, " drew ").concat(numToDraw, " cards")];
        }
    };
    Game.prototype.discard = function (cardName, cardDigit, cardType, playerName) {
        // remove card from playerName hand and place it to the end of stack
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        // remove card from hand
        var cardIndex = this.players[playerName].hand.findIndex(function (card) { return (card.name === cardName && card.digit === cardDigit && card.type === cardType); });
        var cardToDiscard = this.players[playerName].hand.splice(cardIndex, 1)[0];
        cardToDiscard.isPlayable = false;
        // place card on deck
        this.stack.push(cardToDiscard);
        // SK special case for when discard 2 => gain life
        if (this.players[playerName].character.name === "Sid Ketchum") {
            if (this.sidKetchumDiscarded === true && this.players[playerName].character.health < this.players[playerName].character.maxHealth) {
                this.players[playerName].character.health += 1;
                this.sidKetchumDiscarded = false;
            }
            else {
                this.sidKetchumDiscarded = true;
            }
        }
    };
    // ******************* USE CARDS *******************
    Game.prototype.useBang = function (target, cardDigit, cardType, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Bang!", cardDigit, cardType, playerName);
        this.setAllNotPlayable(playerName);
        this.setIsLosingHealth(true, target);
        this.players[target].mancatoPool = 1;
        if (this.players[playerName].character.name === "Slab the Killer") {
            // need 2 Mancato! on StK
            this.players[target].mancatoPool += 1;
        }
        this.setPlayable("Mancato!", target);
        if (this.players[target].character.name === "Calamity Janet") {
            this.setPlayable("Bang!", target);
        }
        this.setCardOnTablePlayable("Barilo", target);
        if (this.players[playerName].table.filter(function (item) { return item.name === 'Vulcanic'; }).length > 0 || this.players[playerName].character.name === "Willy the Kid") {
            // if player has Volcanic or is Willy the Kid don't block Bang!s
            this.bangCanBeUsed = true;
        }
        else {
            this.bangCanBeUsed = false;
        }
        return ["".concat(playerName, " used Bang! on ").concat(target)];
    };
    Game.prototype.useBangAsCJ = function (playerName, cardDigit, cardType) {
        var message = [];
        this.players[playerName].mancatoPool -= 1;
        this.discard("Bang!", cardDigit, cardType, playerName);
        message.push("".concat(playerName, " used Bang! as Mancato!"));
        if (this.players[playerName].mancatoPool === 0) {
            this.setCardOnTableNotPlayable("Barilo", playerName);
            this.setAllNotPlayable(playerName);
            this.setIsLosingHealth(false, playerName);
            // if there is player loosing health, return
            // if no player is found, set playable for playerPlaceholder
            for (var _i = 0, _a = this.getPlayersLosingHealth(); _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.isLosingHealth)
                    return message;
            }
            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        }
        return message;
    };
    Game.prototype.useBangOnIndiani = function (cardDigit, cardType, playerName) {
        this.discard("Bang!", cardDigit, cardType, playerName);
        this.setIsLosingHealth(false, playerName);
        this.setAllNotPlayable(playerName);
        // if there is player loosing health, return
        // if no player is found, set playable for playerPlaceholder
        for (var _i = 0, _a = this.getPlayersLosingHealth(); _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.isLosingHealth)
                return ["".concat(playerName, " used Bang!")];
        }
        this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        this.indianiActive = false;
        return ["".concat(playerName, " used Bang!")];
    };
    Game.prototype.useMancatoOnIndiani = function (cardDigit, cardType, playerName) {
        this.discard("Mancato!", cardDigit, cardType, playerName);
        this.setIsLosingHealth(false, playerName);
        this.setAllNotPlayable(playerName);
        // if there is player loosing health, return
        // if no player is found, set playable for playerPlaceholder
        for (var _i = 0, _a = this.getPlayersLosingHealth(); _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.isLosingHealth)
                return ["".concat(playerName, " used Mancato! as Bang!")];
        }
        this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        this.indianiActive = false;
        return ["".concat(playerName, " used Mancato! as Bang!")];
    };
    Game.prototype.useBangInDuel = function (cardDigit, cardType, playerName) {
        // special case of Bang! use, sets the next turn of the duel state
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Bang!", cardDigit, cardType, playerName);
        this.setNotPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(false, this.duelPlayers[this.duelTurnIndex]);
        this.setAllNotPlayable(playerName);
        // shift to the next player in duel (duelPlayers.length should always = 2)
        this.duelTurnIndex = (this.duelTurnIndex + 1) % 2;
        // set next players Ban!g cards playable
        this.setPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        if (this.players[this.duelPlayers[this.duelTurnIndex]].character.name === "Calamity Janet") {
            this.setPlayable("Mancato!", this.duelPlayers[this.duelTurnIndex]);
        }
        this.setIsLosingHealth(true, this.duelPlayers[this.duelTurnIndex]);
        return ["".concat(playerName, " used Bang! in duel")];
    };
    Game.prototype.useMancato = function (playerName, cardDigit, cardType) {
        var message = ["".concat(playerName, " used Mancato!")];
        this.discard("Mancato!", cardDigit, cardType, playerName);
        this.players[playerName].mancatoPool -= 1;
        if (this.players[playerName].mancatoPool === 0) {
            this.setAllNotPlayable(playerName);
            this.setCardOnTableNotPlayable("Barilo", playerName);
            this.setIsLosingHealth(false, playerName);
            if (this.indianiActive) {
                // CJ can play Mancato! on Indiani, so disable all cards if this happens
                this.setAllNotPlayable(playerName);
            }
            // if there is player loosing health, return
            // if no player is found, set playable for playerPlaceholder
            for (var _i = 0, _a = this.getPlayersLosingHealth(); _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.isLosingHealth)
                    return message;
            }
            this.gatlingActive = false;
            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        }
        return message;
    };
    Game.prototype.useMancatoInDuel = function (cardDigit, cardType, playerName) {
        // special case of Bang! use, sets the next turn of the duel state
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Mancato!", cardDigit, cardType, playerName);
        this.setNotPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setNotPlayable("Mancato!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(false, this.duelPlayers[this.duelTurnIndex]);
        this.setAllNotPlayable(playerName);
        // shift to the next player in duel (duelPlayers.length should always = 2)
        this.duelTurnIndex = (this.duelTurnIndex + 1) % 2;
        // set next players Ban!g cards playable
        this.setPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(true, this.duelPlayers[this.duelTurnIndex]);
        return ["".concat(playerName, " used Mancato! as Bang! in duel")];
    };
    Game.prototype.useMancatoAsCJ = function (target, cardDigit, cardType, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Mancato!", cardDigit, cardType, playerName);
        this.players[target].mancatoPool = 1;
        this.setPlayable("Mancato!", target);
        this.setCardOnTablePlayable("Barilo", target);
        this.setAllNotPlayable(playerName);
        if (this.players[playerName].table.filter(function (item) { return item.name === 'Vulcanic'; }).length > 0 || this.players[playerName].character.name === "Willy the Kid") {
            // if player has Volcanic or is Willy the Kid don't block Bang!s
            this.bangCanBeUsed = true;
        }
        else {
            this.bangCanBeUsed = false;
        }
        this.setIsLosingHealth(true, target);
        return ["".concat(playerName, " used Mancato! as Bang! on ").concat(target)];
    };
    Game.prototype.useCatBallou = function (target, cardDigit, cardType, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        var message = [];
        this.discard("Cat Balou", cardDigit, cardType, playerName);
        message.push("".concat(playerName, " used Cat Balou on ").concat(target));
        // get random card from target hand
        var randomCard = this.getPlayerHand(target)[Math.floor(Math.random() * this.getPlayerHand(target).length)];
        this.discard(randomCard.name, randomCard.digit, randomCard.type, target);
        message.push("".concat(target, " discarded ").concat(randomCard.name));
        return message;
    };
    Game.prototype.useCatBallouOnTableCard = function (activeCard, target, cardDigit, cardType, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Cat Balou", activeCard.digit, activeCard.type, playerName);
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            // remove from table object where name === target
            for (var j = 0; j < this.players[player].table.length; j++) {
                if (this.players[player].table[j].name === target && this.players[player].table[j].digit === cardDigit && this.players[player].table[j].type === cardType) {
                    var foundCard = this.players[player].table.splice(j, 1)[0];
                    this.stack.push(foundCard);
                }
            }
        }
        return ["".concat(playerName, " used Cat Balou on ").concat(target)];
    };
    Game.prototype.usePanico = function (target, cardDigit, cardType, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Panico", cardDigit, cardType, playerName);
        // if targer is player, steal random card from his hand
        // get random card from target hand
        var randomCard = this.getPlayerHand(target)[Math.floor(Math.random() * this.getPlayerHand(target).length)];
        if (!randomCard)
            return;
        if (randomCard.name === "Mancato!") {
            // if chosen card Mancato! set isNotPlayable
            randomCard.isPlayable = false;
        }
        else if (randomCard.name === "Bang!" && !this.bangCanBeUsed) {
            // if chosen card Bang! set isNotPlayable if Bang! can!t be used
            randomCard.isPlayable = false;
        }
        else {
            // set playable
            randomCard.isPlayable = true;
        }
        var currentPlayerHand = this.players[playerName].hand;
        var targetPlayerHand = this.players[target].hand;
        // remove card from hand
        for (var i = 0; i < targetPlayerHand.length; i++) {
            if (targetPlayerHand[i].digit === randomCard.digit && targetPlayerHand[i].type === randomCard.type) {
                targetPlayerHand.splice(i, 1);
                break;
            }
        }
        currentPlayerHand.push(randomCard);
        this.setAllPlayable(playerName);
        this.setMancatoBeerNotPlayable(playerName);
        return ["".concat(playerName, " used Panico on ").concat(target)];
    };
    Game.prototype.usePanicoOnTableCard = function (activeCard, target, cardDigit, cardType, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Panico", activeCard.digit, activeCard.type, playerName);
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            // remove from table object where name === target
            for (var j = 0; j < this.players[player].table.length; j++) {
                if (this.players[player].table[j].name === target && this.players[player].table[j].digit === cardDigit && this.players[player].table[j].type === cardType) {
                    var foundCard = this.players[player].table.splice(j, 1)[0];
                    foundCard.isPlayable = true;
                    this.players[playerName].hand.push(foundCard);
                }
            }
        }
        return ["".concat(playerName, " used Panico on ").concat(target)];
    };
    Game.prototype.placeBlueCardOnTable = function (card, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        var cardInHandIndex = this.players[playerName].hand.findIndex(function (cardInHand) { return (cardInHand.name === card.name && cardInHand.digit === card.digit && cardInHand.type === card.type); });
        this.players[playerName].hand.splice(cardInHandIndex, 1)[0]; // this can't be handled by this.discard() because decision must be made weather to push card on table or stack
        if (card["class"] === "horse") {
            // two horses allowed on table, so filter by name
            if (this.players[playerName].table.filter(function (cardOnTable) { return cardOnTable.name === card.name; }).length > 0) {
                // remove card from table
                var cardOnTableIndex = this.players[playerName].table.findIndex(function (cardOnTable) { return (cardOnTable.name === card.name); });
                var removedCard = this.players[playerName].table.splice(cardOnTableIndex, 1)[0];
                this.stack.push(removedCard);
            }
        }
        else if (card["class"] === "dynamite") {
        }
        else {
            // only one gun card of same class allowed so filter by class
            if (this.players[playerName].table.filter(function (cardOnTable) { return cardOnTable["class"] === card["class"]; }).length > 0) {
                // remove card from table
                var cardOnTableIndex = this.players[playerName].table.findIndex(function (foundCard) { return (foundCard["class"] === card["class"]); });
                var removedCard = this.players[playerName].table.splice(cardOnTableIndex, 1)[0];
                if (removedCard.name === "Vulcanic")
                    this.bangCanBeUsed = false;
                this.stack.push(removedCard);
            }
        }
        if (card.name === "Vulcanic") {
            this.bangCanBeUsed = true;
            // reset Bang!s in player hand to playable again
            for (var _i = 0, _a = this.players[playerName].hand; _i < _a.length; _i++) {
                var card_1 = _a[_i];
                if (card_1.name === "Bang!") {
                    card_1.isPlayable = true;
                }
            }
        }
        // put on table
        card.isPlayable = false;
        this.players[playerName].table.push(card);
        return ["".concat(playerName, " placed ").concat(card.name, " on table")];
    };
    Game.prototype.useBeer = function (playerName, cardDigit, cardType) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Beer", cardDigit, cardType, playerName);
        this.players[playerName].character.health += 1;
        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName); // do not let player play beer if not max HP
        }
        return ["".concat(playerName, " used Beer")];
    };
    Game.prototype.useSaloon = function (playerName, cardDigit, cardType) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Saloon", cardDigit, cardType, playerName);
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            // put hit on all players, except playerName
            if (this.players[player].character.health > 0 && this.players[player].character.health < this.players[player].character.maxHealth) {
                this.players[player].character.health += 1;
            }
        }
        return ["".concat(playerName, " used Saloon")];
    };
    Game.prototype.useEmporio = function (playerName, cardDigit, cardType) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Emporio", cardDigit, cardType, playerName);
        this.setAllNotPlayable(playerName);
        this.emporio = []; // this is not necessary, but to be sure
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            if (this.players[player].character.health > 0) {
                // don't include dead players in Emporio
                this.emporio.push(this.deck[0]);
                this.deck.shift();
            }
        }
        this.nextEmporioTurn = playerName;
        return ["".concat(playerName, " used Emporio")];
    };
    Game.prototype.getEmporioCard = function (playerName, card) {
        var _this = this;
        var getCardIndex = this.emporio.findIndex(function (foundCard) { return (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type); });
        // return if card not found
        if (getCardIndex < 0)
            return;
        var emporioCard = this.emporio[getCardIndex];
        emporioCard.isPlayable = false;
        // place card in player hand
        this.players[playerName].hand.push(emporioCard);
        // remove from emporio
        this.emporio.splice(getCardIndex, 1);
        if (this.emporio.length <= 0) {
            // end when no cards to draw
            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            this.emporio = [];
            this.nextEmporioTurn = "";
            return;
        }
        var playerNames = Object.keys(this.players);
        var currentEmporioTurnPlayerIndex = playerNames.findIndex(function (player) { return player === _this.nextEmporioTurn; });
        // find next alive player
        for (var i = 0; i < this.numOfPlayers; i++) {
            currentEmporioTurnPlayerIndex += 1;
            if (currentEmporioTurnPlayerIndex >= this.numOfPlayers) {
                currentEmporioTurnPlayerIndex = 0;
            }
            var nextPlayer = Object.keys(this.players).find(function (key) { return _this.players[key].id === currentEmporioTurnPlayerIndex; });
            if (nextPlayer && this.players[nextPlayer].character.health > 0) {
                //this.players[nextPlayer].table.push(card);
                break;
            }
        }
        this.nextEmporioTurn = playerNames[currentEmporioTurnPlayerIndex];
    };
    Game.prototype.getChoiceCardKC = function (playerName, card) {
        var getCardIndex = this.drawChoice.findIndex(function (foundCard) { return (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type); });
        // return if card not found
        if (getCardIndex < 0)
            return;
        // place card in player hand
        this.players[playerName].hand.push(this.drawChoice[getCardIndex]);
        // remove from drawChoice
        this.drawChoice.splice(getCardIndex, 1);
        if (this.drawChoice.length === 1) {
            this.stack.push(this.drawChoice[0]);
            // end when no cards to draw
            this.setAllPlayable(playerName);
            this.drawChoice = [];
            return;
        }
    };
    Game.prototype.getChoiceCardLD = function (playerName, card) {
        var getCardIndex = this.drawChoice.findIndex(function (foundCard) { return (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type); });
        // return if card not found
        if (getCardIndex < 0)
            return;
        // place card in player hand
        this.players[playerName].hand.push(this.drawChoice[getCardIndex]);
        // remove from drawChoice
        this.drawChoice.splice(getCardIndex, 1);
        if (this.luckyDukeFirstDraw) {
            this.stack.push(this.drawChoice[0]);
            // end when no cards to draw
            this.luckyDukeFirstDraw = false;
            this.drawChoice = [];
            for (var i = 0; i < 2; i++) {
                var card_2 = this.deck[0];
                this.drawChoice.push(card_2);
                this.deck.shift();
            }
            return;
        }
        else {
            this.stack.push(this.drawChoice[0]);
            this.setAllPlayable(playerName);
            this.drawChoice = [];
            this.luckyDukeFirstDraw = true;
            return;
        }
    };
    Game.prototype.getStackCardPR = function (playerName) {
        // place card in player hand
        this.players[playerName].hand.push(this.getTopStackCard());
        // remove from stack
        this.stack.pop();
        this.draw(1, playerName);
        this.setAllPlayable(playerName);
        this.awaitDrawChoice = false;
        return ["Pedro Ramirez drew first crad from stack"];
    };
    Game.prototype.useDiligenza = function (playerName, cardDigit, cardType) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Diligenza", cardDigit, cardType);
        this.draw(2, playerName);
        this.setAllPlayable(playerName);
        return ["".concat(playerName, " used Diligenza")];
    };
    Game.prototype.useWellsFargo = function (playerName, cardDigit, cardType) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Wells Fargo", cardDigit, cardType);
        this.draw(3, playerName);
        this.setAllPlayable(playerName);
        return ["".concat(playerName, " used Wells Fargo")];
    };
    Game.prototype.useDuel = function (target, cardDigit, cardType, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Duel", cardDigit, cardType, playerName);
        this.duelPlayers = [target, playerName];
        this.duelTurnIndex = 0;
        this.setPlayable("Bang!", target);
        if (this.players[target].character.name === "Calamity Janet") {
            this.setPlayable("Mancato!", this.duelPlayers[this.duelTurnIndex]);
        }
        this.setIsLosingHealth(true, target);
        this.setAllNotPlayable(playerName);
        this.duelActive = true;
        return ["".concat(playerName, " used Duel on ").concat(target)];
    };
    Game.prototype.useGatling = function (playerName, cardDigit, cardType) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Gatling", cardDigit, cardType, playerName);
        if (this.players[playerName].character.name === "Slab the Killer") {
            this.gatlingActive = true;
        }
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var target = _a[_i];
            // put hit on all players, except playerName and dead players
            if (target !== playerName && this.players[target].character.health > 0) {
                this.setPlayable("Mancato!", target);
                if (this.players[target].character.name === "Calamity Janet") {
                    this.setPlayable("Bang!", target);
                }
                this.setCardOnTablePlayable("Barilo", target);
                this.setIsLosingHealth(true, target);
                this.players[target].mancatoPool = 1;
            }
        }
        this.setAllNotPlayable(playerName);
        return ["".concat(playerName, " used Gatling")];
    };
    Game.prototype.useIndiani = function (playerName, cardDigit, cardType) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        this.discard("Indiani", cardDigit, cardType, playerName);
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var target = _a[_i];
            // put hit on all players, except playerName
            if (target !== playerName && this.players[target].character.health > 0) {
                this.setPlayable("Bang!", target);
                if (this.players[target].character.name === "Calamity Janet") {
                    this.setPlayable("Mancato!", target);
                }
                this.setIsLosingHealth(true, target);
            }
        }
        this.indianiActive = true;
        this.setAllNotPlayable(playerName);
        return ["".concat(playerName, " used Indiani")];
    };
    Game.prototype.playPrigione = function (target, card, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        // put prison in other players' table
        var cardIndex = this.players[playerName].hand.findIndex(function (foundCard) { return (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type); });
        this.players[playerName].hand.splice(cardIndex, 1)[0];
        card.isPlayable = false;
        this.players[target].table.push(card);
        return ["".concat(playerName, " put ").concat(target, " in prison")];
    };
    Game.prototype.useBarel = function (playerName) {
        var message;
        var drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard);
        message = ["".concat(playerName, " drew ").concat(drawnCard.name, " ").concat(drawnCard.digit, " ").concat(drawnCard.type, " on barel")];
        this.setCardOnTableNotPlayable("Barilo", playerName);
        if (drawnCard.type === "hearts") {
            this.players[playerName].mancatoPool -= 1;
            if (this.players[playerName].mancatoPool === 0) {
                this.setAllNotPlayable(playerName);
                this.setIsLosingHealth(false, playerName);
                this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            }
        }
        return message;
    };
    Game.prototype.useDynamite = function (playerName, card) {
        var _this = this;
        card.isPlayable = false;
        var drawnCard = this.deck[0];
        var secondDrawnCard = {
            name: "",
            rimColor: "",
            digit: 0,
            type: "",
            isPlayable: false
        };
        this.deck.shift();
        this.stack.push(drawnCard);
        var message = ["".concat(playerName, " drew ").concat(drawnCard.name, " ").concat(drawnCard.digit, " ").concat(drawnCard.type, " on dynamite")];
        if (this.players[playerName].character.name === "Lucky Duke") {
            secondDrawnCard = this.deck[0];
            message.push("".concat(playerName, " drew ").concat(secondDrawnCard.name, " ").concat(secondDrawnCard.digit, " ").concat(secondDrawnCard.type, " on dynamite as Lucky Duke"));
            this.deck.shift();
        }
        // remove from playerName table card object
        this.players[playerName].table = this.players[playerName].table.filter(function (tableCard) {
            return (tableCard.name !== card.name || tableCard.digit !== card.digit || tableCard.type !== card.type);
        });
        if (drawnCard.type === "spades" && (2 <= drawnCard.digit && drawnCard.digit <= 9)) {
            if ((this.players[playerName].character.name === "Lucky Duke" && (secondDrawnCard.type !== "spades" && 2 >= secondDrawnCard.digit && secondDrawnCard.digit >= 9))) {
                // LD drew second outside
                // find next alive player
                var currentPlayerId_1 = this.playerRoundId + 1;
                if (currentPlayerId_1 >= this.numOfPlayers) {
                    currentPlayerId_1 = 0;
                }
                for (var i = 0; i < this.numOfPlayers; i++) {
                    var nextPlayer = Object.keys(this.players).find(function (key) { return _this.players[key].id === currentPlayerId_1; });
                    if (nextPlayer && this.players[nextPlayer].character.health > 0) {
                        this.players[nextPlayer].table.push(card);
                        break;
                    }
                    currentPlayerId_1 += 1;
                    // clamp player ID
                    if (currentPlayerId_1 >= this.numOfPlayers) {
                        currentPlayerId_1 = 0;
                    }
                }
            }
            else {
                // DEATH rest of the players
                message.push("Dynamite exploded!");
                for (var i = 0; i < 3; i++) {
                    message.push.apply(message, this.loseHealth(playerName));
                    if (this.players[playerName].character.health <= 0) {
                        this.setAllNotPlayable(playerName);
                        this.setAllCardsOnTableNotPlayable(playerName);
                    }
                }
            }
        }
        else {
            // find next alive player
            var currentPlayerId_2 = this.playerRoundId + 1;
            if (currentPlayerId_2 >= this.numOfPlayers) {
                currentPlayerId_2 = 0;
            }
            for (var i = 0; i < this.numOfPlayers; i++) {
                var nextPlayer = Object.keys(this.players).find(function (key) { return _this.players[key].id === currentPlayerId_2; });
                if (nextPlayer && this.players[nextPlayer].character.health > 0) {
                    this.players[nextPlayer].table.push(card);
                    break;
                }
                currentPlayerId_2 += 1;
                // clamp player ID
                if (currentPlayerId_2 >= this.numOfPlayers) {
                    currentPlayerId_2 = 0;
                }
            }
        }
        if (!this.getPlayerHasDynamite(playerName) && !this.getPlayerIsInPrison(playerName)) {
            var currentPlayerName = this.getNameOfCurrentTurnPlayer();
            if (this.players[currentPlayerName].character.name === "Lucky Duke") {
                // populate create draw choice for Lucky Duke
                this.drawChoice = [];
                for (var i = 0; i < 2; i++) {
                    var card_3 = this.deck[0];
                    this.drawChoice.push(card_3);
                    this.deck.shift();
                }
                return message;
            }
            else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
                // populate create draw choice for Kit Carlson
                this.drawChoice = [];
                for (var i = 0; i < 3; i++) {
                    var card_4 = this.deck[0];
                    this.drawChoice.push(card_4);
                    this.deck.shift();
                }
                return message;
            }
            // if not dynamite on table, allow use cards except Jesse Jones
            if (this.players[playerName].character.name !== "Pedro Ramirez" && this.players[playerName].character.name !== "Jesse Jones" && this.stack.length > 0) {
                this.draw(2, playerName);
                this.setAllPlayable(playerName);
            }
        }
        else {
            this.setAllNotPlayable(playerName);
        }
        return message;
    };
    Game.prototype.usePrigione = function (playerName, card) {
        card.isPlayable = false;
        // place prison on stack
        this.stack.push(card);
        // draw card
        var drawnCard = this.deck[0];
        var secondDrawnCard = {
            name: "",
            rimColor: "",
            digit: 0,
            type: "",
            isPlayable: false
        };
        this.deck.shift();
        this.stack.push(drawnCard);
        var message = ["".concat(playerName, " drew ").concat(drawnCard.name, " ").concat(drawnCard.digit, " ").concat(drawnCard.type, " on prison")];
        if (this.players[playerName].character.name === "Lucky Duke") {
            // Lucky Duke second card
            secondDrawnCard = this.deck[0];
            this.deck.shift();
            this.stack.push(secondDrawnCard);
            message = ["".concat(playerName, " as Lucky Duke drew ").concat(drawnCard.name, " ").concat(drawnCard.digit, " ").concat(drawnCard.type, " and ").concat(secondDrawnCard.name, " ").concat(secondDrawnCard.digit, " ").concat(secondDrawnCard.type, " on Prigione")];
        }
        // remove from playerName table card object
        this.players[playerName].table = this.players[playerName].table.filter(function (tableCard) {
            return (tableCard.name !== card.name || tableCard.digit !== card.digit || tableCard.type !== card.type);
        });
        if (drawnCard.type === "hearts" || (this.players[playerName].character.name === "Lucky Duke" && secondDrawnCard.type === "hearts")) {
            if (!this.getPlayerHasDynamite(playerName) && !this.getPlayerIsInPrison(playerName)) {
                var currentPlayerName = this.getNameOfCurrentTurnPlayer();
                if (this.players[currentPlayerName].character.name === "Lucky Duke") {
                    // populate create draw choice for Lucky Duke
                    this.drawChoice = [];
                    for (var i = 0; i < 2; i++) {
                        var card_5 = this.deck[0];
                        this.drawChoice.push(card_5);
                        this.deck.shift();
                    }
                    return message;
                }
                else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
                    // populate create draw choice for Kit Carlson
                    this.drawChoice = [];
                    for (var i = 0; i < 3; i++) {
                        var card_6 = this.deck[0];
                        this.drawChoice.push(card_6);
                        this.deck.shift();
                    }
                    return message;
                }
                else if (this.players[currentPlayerName].character.name === "Jesse Jones") {
                    this.awaitDrawChoice = true;
                    return message;
                }
                // if not prigione on table, allow use cards except
                if (this.players[playerName].character.name !== "Pedro Ramirez" && this.stack.length > 0) {
                    this.draw(2, playerName);
                    this.setAllPlayable(playerName);
                    return message;
                }
            }
            return message;
        }
        else {
            // next player round
            this.setAllCardsOnTableNotPlayable(playerName);
            this.endTurn();
            return message;
        }
    };
    Game.prototype.loseHealth = function (playerName) {
        var message = ["".concat(playerName, " lost health")];
        this.players[playerName].character.health -= 1;
        this.players[playerName].mancatoPool = 0;
        this.setIsLosingHealth(false, playerName);
        this.setNotPlayable("Mancato!", playerName);
        if (this.players[playerName].character.name === "Calamity Janet") {
            this.setNotPlayable("Bang!", playerName);
        }
        this.setCardOnTableNotPlayable("Barilo", playerName);
        if (this.players[playerName].character.name === "Bart Cassidy" && !this.indianiActive) {
            // Bart Cassidy draws a card on hit
            // this works on all damage taken except Indiani -> could cause problems
            if (this.players[playerName].table.filter(function (foundCard) { return foundCard.name === "Dynamite"; }).lenght === 0) {
                message.push(this.draw(1, playerName));
            }
            else {
                if (this.getNameOfCurrentTurnPlayer() !== playerName) {
                    message.push(this.draw(1, playerName));
                }
            }
        }
        if (playerName !== this.getNameOfCurrentTurnPlayer()) {
            // if not players turn, disable his Bang!
            // this is for lose life when Indiani
            this.setNotPlayable("Bang!", playerName);
        }
        if (this.duelActive) {
            this.duelActive = false;
            this.duelTurnIndex = 0;
            this.duelPlayers = [];
            if (this.bangCanBeUsed) {
                this.setNotPlayable("Bang!", playerName);
                this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            }
        }
        //El Gringo can draw from oponent when hit by Bang! or Gatling
        // Mancato! has also be in stack because of CJ
        if (this.players[playerName].character.name === "El Gringo" && (this.getTopStackCard().name === "Bang!" || this.getTopStackCard().name === "Mancato!" || this.getTopStackCard().name === "Gatling")) {
            var playerHandLenght = this.players[this.getNameOfCurrentTurnPlayer()].hand.length;
            if (playerHandLenght > 0) {
                var randomCardIndex = Math.floor(Math.random() * playerHandLenght);
                var randomCard = this.players[this.getNameOfCurrentTurnPlayer()].hand.shift(randomCardIndex, 1);
                randomCard.isPlayable = false;
                this.players[playerName].hand.push(randomCard);
                message.push("El Gringo was hit, so he draws 1 card");
            }
        }
        this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        if (!this.gatlingActive && !this.indianiActive) {
            // if no gatling, continue
        }
        else {
            // on gatling, activate playerPlaceholder only when all reactions
            // if there is player losing health, return
            // if no player is found, set playable for playerPlaceholder
            var someoneLosingHealth = false;
            for (var _i = 0, _a = this.getPlayersLosingHealth(); _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.isLosingHealth)
                    someoneLosingHealth = true;
            }
            if (!someoneLosingHealth) {
                this.gatlingActive = false;
                this.indianiActive = false;
            }
            else {
                this.setAllNotPlayable(this.getNameOfCurrentTurnPlayer());
            }
        }
        // 0 health -> lose game
        if (this.players[playerName].character.health <= 0) {
            // if player were to die, allow him to play beer
            for (var _b = 0, _c = this.players[playerName].hand; _b < _c.length; _b++) {
                var card = _c[_b];
                if (card.name === "Beer") {
                    this.useBeer(playerName, card.digit, card.type);
                    this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
                    message.push("".concat(playerName, " had Beer, so he used it"));
                    return message;
                }
            }
            // LOSE GAME
            this.setAllNotPlayable(playerName);
            this.setAllCardsOnTableNotPlayable(playerName);
            for (var _d = 0, _e = Object.keys(this.players); _d < _e.length; _d++) {
                var player = _e[_d];
                if (this.players[player].character.name === "Vulture Sam" && this.players[player].character.health > 0 && player !== playerName) {
                    // if there is Vulture Sam, put dead player's hand to his hand
                    message.push("Vulture Sam received the hand of ".concat(playerName));
                    for (var _f = 0, _g = this.players[playerName].hand; _f < _g.length; _f++) {
                        var card = _g[_f];
                        if (player === this.getNameOfCurrentTurnPlayer()) {
                            // inside VS turn
                            if (!this.bangCanBeUsed && card.name === "Bang!") {
                                // players turn and can use Bang!
                                card.isPlayable = false;
                            }
                            else if (card.name === "Mancato!") {
                                card.isPlayable = false;
                            }
                            else if (card.name === "Beer" && this.players[player].character.health === this.players[player].character.maxHealth) {
                                card.isPlayable = false;
                            }
                            else {
                                card.isPlayable = true;
                            }
                        }
                        else {
                            // outside VS turn
                            card.isPlayable = false;
                        }
                        this.players[player].hand.push(card);
                    }
                    this.players[playerName].hand = [];
                    break;
                }
            }
            if (playerName === this.getNameOfCurrentTurnPlayer()) {
                // if is current players' turn and he dies, end his turn
                message.push.apply(message, this.endTurn());
            }
            if (this.players[this.getNameOfCurrentTurnPlayer()].character.role === "Sheriff" && this.players[playerName].character.role === "Vice") {
                // Sheriff killed Vice, discard his hand
                for (var i = 0; i < this.players[this.getNameOfCurrentTurnPlayer()].hand.length; i++) {
                    var card = this.players[this.getNameOfCurrentTurnPlayer()].hand[i];
                    this.discard(card.name, card.digit, card.type, this.getNameOfCurrentTurnPlayer());
                }
                this.players[this.getNameOfCurrentTurnPlayer()].hand = [];
                message.push("Sheriff killed Vice!");
            }
            // Bandit death, draw 3
            // also outside player turn, so would not activate on Dynamite
            if (this.players[playerName].character.role === "Bandit" && playerName !== this.getNameOfCurrentTurnPlayer()) {
                this.draw(3, this.getNameOfCurrentTurnPlayer());
                this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            }
            this.knownRoles[playerName] = this.players[playerName].character.role;
            message.push("".concat(playerName, " has died!"));
            if (!this.gameEnded) {
                // if not game ended, check for winner
                // ********* GAME END *********
                var aliveRoles = [];
                var deadRoles = [];
                for (var _h = 0, _j = Object.keys(this.players); _h < _j.length; _h++) {
                    var player = _j[_h];
                    if (this.players[player].character.health > 0) {
                        aliveRoles.push(this.players[player].character.role);
                    }
                    else {
                        deadRoles.push(this.players[player].character.role);
                    }
                }
                if (aliveRoles.includes("Sheriff") && (!aliveRoles.includes("Bandit") && !aliveRoles.includes("Renegade"))) {
                    // SHERIFF AND VICE WIN
                    if (aliveRoles.includes("Vice") || deadRoles.includes("Vice")) {
                        // Vice in game
                        message.push("Sheriff (".concat(this.getNameOfPlayersByRole("Sheriff")[0], ") and Vice (").concat(this.getNameOfPlayersByRole("Vice")[0], ") victory!"));
                        message.push("Game ended");
                        this.endGame();
                    }
                    else {
                        // Vice not in game
                        message.push("Sheriff (".concat(this.getNameOfPlayersByRole("Sheriff")[0], ") victory!"));
                        message.push("Game ended");
                        this.endGame();
                    }
                }
                else if (aliveRoles.includes("Bandit") && deadRoles.includes("Sheriff")) {
                    // BANDITS WIN
                    var bandits = this.getNameOfPlayersByRole("Bandit");
                    if (bandits.length === 1) {
                        message.push("Bandit (".concat(bandits[0], ") victory!"));
                        message.push("Game ended");
                    }
                    else if (bandits.length === 2) {
                        message.push("Bandits (".concat(bandits[0], ", ").concat(bandits[1], ") victory!"));
                        message.push("Game ended");
                    }
                    else if (bandits.length === 3) {
                        message.push("Bandits (".concat(bandits[0], ", ").concat(bandits[1], ", ").concat(bandits[2], ") victory!"));
                        message.push("Game ended");
                    }
                    this.endGame();
                }
                else if (aliveRoles.includes("Renegade") && (!aliveRoles.includes("Sheriff") && !aliveRoles.includes("Vice") && !aliveRoles.includes("Bandit"))) {
                    // RENEGADE WIN
                    message.push("Renegade (".concat(this.getNameOfPlayersByRole("Renegade")[0], ") victory!"));
                    message.push("Game ended");
                    this.endGame();
                }
                else if (this.numOfPlayers === 2) {
                    // 1v1 WIN
                    message.push("".concat(this.getNameOfCurrentTurnPlayer(), " is winner!"));
                    message.push("Game ended");
                    this.endGame();
                }
            }
        }
        return message;
    };
    Game.prototype.jesseJonesTarget = function (target, playerName) {
        if (playerName === void 0) { playerName = this.getNameOfCurrentTurnPlayer(); }
        // continue with turn
        this.draw(1, playerName);
        this.awaitDrawChoice = false;
        // if targer is player, steal random card from his hand
        // get random card from target hand
        var randomCard = this.getPlayerHand(target)[Math.floor(Math.random() * this.getPlayerHand(target).length)];
        if (!randomCard)
            return ['No card found'];
        var currentPlayerHand = this.players[playerName].hand;
        var targetPlayerHand = this.players[target].hand;
        // remove card from hand
        for (var i = 0; i < targetPlayerHand.length; i++) {
            if (targetPlayerHand[i].digit === randomCard.digit && targetPlayerHand[i].type === randomCard.type) {
                targetPlayerHand.splice(i, 1);
                break;
            }
        }
        currentPlayerHand.push(randomCard);
        this.setAllPlayable(playerName);
        return ["".concat(playerName, " stole 1 card from ").concat(target, " because he's Jesse Jones")];
    };
    Game.prototype.jourdonnaisBarel = function (playerName) {
        var drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard);
        var playerPlaceholder = this.getNameOfCurrentTurnPlayer();
        if (drawnCard.type === "hearts") {
            this.players[playerName].mancatoPool -= 1;
            if (this.players[playerName].mancatoPool === 0) {
                this.setIsLosingHealth(false, playerName);
                this.setAllNotPlayable(playerName);
                this.setAllPlayable(playerPlaceholder);
            }
        }
        return ["".concat(playerName, " drew ").concat(drawnCard.name, " ").concat(drawnCard.digit, " ").concat(drawnCard.type, " on Jourdonnais")];
    };
    // ******************* SETERS *******************
    Game.prototype.setPlayable = function (cardName, playerName) {
        // sets cardName in playerName hand to isPlayable = true
        for (var _i = 0, _a = this.players[playerName].hand; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.name === cardName) {
                card.isPlayable = true;
            }
        }
    };
    Game.prototype.setNotPlayable = function (cardName, playerName) {
        // sets cardName in playerName hand to isPlayable = false
        for (var _i = 0, _a = this.players[playerName].hand; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.name === cardName) {
                card.isPlayable = false;
            }
        }
    };
    Game.prototype.setAllPlayable = function (playerName) {
        // sets all cards in playerName hand to isPlayable = true
        for (var _i = 0, _a = this.players[playerName].hand; _i < _a.length; _i++) {
            var card = _a[_i];
            card.isPlayable = true;
        }
        this.setMancatoBeerNotPlayable(playerName);
        if (this.bangCanBeUsed) {
            if (this.players[playerName].character.name === "Calamity Janet") {
                // allow Mancato! for CJ
                this.setPlayable("Mancato!", playerName);
            }
        }
        else {
            this.setNotPlayable("Bang!", playerName);
        }
    };
    Game.prototype.setAllNotPlayable = function (playerName) {
        // sets cards in playerName hand to isPlayable = false
        for (var _i = 0, _a = this.players[playerName].hand; _i < _a.length; _i++) {
            var card = _a[_i];
            card.isPlayable = false;
        }
    };
    Game.prototype.setCardOnTablePlayable = function (cardName, playerName) {
        // sets cardName in playerName table to isPlayable = true
        for (var _i = 0, _a = this.players[playerName].table; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.name === cardName) {
                card.isPlayable = true;
            }
        }
    };
    Game.prototype.setCardOnTableNotPlayable = function (cardName, playerName) {
        // sets cardName in playerName hand to isPlayable = false
        for (var _i = 0, _a = this.players[playerName].table; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.name === cardName) {
                card.isPlayable = false;
            }
        }
    };
    Game.prototype.setAllCardsOnTableNotPlayable = function (playerName) {
        // sets cards in playerName hand to isPlayable = false
        for (var _i = 0, _a = this.players[playerName].table; _i < _a.length; _i++) {
            var card = _a[_i];
            card.isPlayable = false;
        }
    };
    Game.prototype.setMancatoBeerNotPlayable = function (playerName) {
        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName); // let player play beer if not max HP
        }
        this.setNotPlayable("Mancato!", playerName); // let player play beer if not max HP
        if (this.players[playerName].character.name === "Calamity Janet" && this.players[playerName].table.filter(function (item) { return item.name === 'Vulcanic'; }).length > 0) {
            this.setPlayable("Mancato!", playerName);
        }
    };
    Game.prototype.setCharacter = function (playerName, characterName) {
        // sets player character and resolves his health and starting hand size
        this.players[playerName].character.name = characterName;
        var startingHealth = 4;
        if (characterName === "El Gringo")
            startingHealth = 3;
        if (characterName === "Paul Regret")
            startingHealth = 3;
        this.players[playerName].character.maxHealth = startingHealth;
        this.players[playerName].character.health = startingHealth;
        this.players[playerName].character.startingHandSize = startingHealth;
    };
    // ******************* GETERS *******************
    Game.prototype.getAllPlayersInfo = function () {
        // returns array [{name, numberOfCards, health, table}]
        var state = [];
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            state.push({
                name: player,
                numberOfCards: this.players[player].hand.length,
                health: this.players[player].character.health,
                table: this.players[player].table
            });
        }
        return state;
    };
    Game.prototype.getCharacters = function () {
        // returns array [{name, character}]
        var state = [];
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            state.push({
                name: player,
                character: this.players[player].character.name
            });
        }
        return state;
    };
    Game.prototype.getNumOfCardsInEachHand = function () {
        // returns array [{name, numberOfCards}]
        var state = [];
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            state.push({
                name: player,
                numberOfCards: this.players[player].hand.length
            });
        }
        return state;
    };
    Game.prototype.getPlayersLosingHealth = function () {
        // return array [{name, isLosingHealth}]
        var state = [];
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            state.push({
                name: player,
                isLosingHealth: this.players[player].isLosingHealth
            });
        }
        return state;
    };
    Game.prototype.getPlayersWithActionRequired = function () {
        // TODO: this does not have tu run every turn?
        // return array [{name, hasDynamite}]
        // if is players current turn and has dynamite in table, set hasDynamite = true
        var state = [];
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            // if player is on turn and has dynamite on table
            var dynamiteFound = false;
            var prisonFound = false;
            var actionRequired = false;
            if (player === this.getNameOfCurrentTurnPlayer()) {
                if (this.getPlayerHasDynamite(player)) {
                    dynamiteFound = true;
                }
                if (this.getPlayerIsInPrison(player)) {
                    prisonFound = true;
                }
                if (this.players[player].character.name === "Jesse Jones" && this.awaitDrawChoice) {
                    actionRequired = true;
                }
                if (this.players[player].character.name === "Pedro Ramirez" && this.stack.length > 0 && this.awaitDrawChoice) {
                    actionRequired = true;
                }
            }
            state.push({
                name: player,
                hasDynamite: dynamiteFound,
                isInPrison: prisonFound,
                actionRequired: actionRequired
            });
        }
        return state;
    };
    Game.prototype.getPlayersInRange = function (playerName, range) {
        // returns array of alive players closer than range to playerName
        // return array of all players if range === "max"
        var playerNames = Object.keys(this.players); // array of player names;
        for (var _i = 0, playerNames_1 = playerNames; _i < playerNames_1.length; _i++) {
            var player = playerNames_1[_i];
            if (this.players[player].character.health <= 0) {
                playerNames.splice(playerNames.indexOf(player), 1);
            }
        }
        if (range === "max" || range === "max_not_sheriff") {
            // ******** MAX RANGE ********
            var result = [];
            for (var _a = 0, playerNames_2 = playerNames; _a < playerNames_2.length; _a++) {
                var player = playerNames_2[_a];
                if (this.players[player].character.health > 0 && player !== playerName) {
                    // if player is alive
                    if (range === "max") {
                        result.push(player);
                    }
                    else if (range === "max_not_sheriff") {
                        if (this.players[player].character.role !== "Sheriff") {
                            result.push(player);
                        }
                    }
                }
            }
            return result;
        }
        else if (range === "one_not_gun") {
            // ******** Panico range ********
            var result = [];
            range = 1;
            if (this.players[playerName].character.name === 'Rose Doolan') {
                // Rose Doolan works as Apaloosa
                range += 1;
            }
            // if player has Apaloosa, increase range by 1
            if (this.players[playerName].table.some(function (card) { return card.name === 'Apaloosa'; }))
                range += 1;
            var playerIndex = playerNames.indexOf(playerName) + playerNames.length;
            var concatArray = playerNames.concat(playerNames.concat(playerNames)); // = [...arr, ...arr, ...arr]
            for (var i = 0; i < concatArray.length; i++) {
                var currentName = concatArray[i];
                if (currentName !== playerName && this.players[currentName].character.health > 0) {
                    var currentRange = range;
                    if (this.players[currentName].table.some(function (card) { return card.name === 'Mustang'; }))
                        currentRange -= 1;
                    if (this.players[currentName].character.name === "Paul Regret")
                        currentRange -= 1;
                    if (Math.abs(i - playerIndex) <= currentRange) {
                        result.push(currentName);
                    }
                }
                ;
            }
            return result;
        }
        else if (typeof range === "number") {
            // ******** CUSTOM RANGE ********
            var result = [];
            if (this.players[playerName].character.name === 'Rose Doolan') {
                // Rose Doolan works as Apaloosa
                range += 1;
            }
            // if player has Apaloosa, increase range by 1
            if (this.players[playerName].table.some(function (card) { return card.name === 'Apaloosa'; }))
                range += 1;
            // if player has Schofield, increase range by 1
            if (this.players[playerName].table.some(function (card) { return card.name === 'Schofield'; }))
                range += 1;
            // if player has Remington, increase range by 2
            if (this.players[playerName].table.some(function (card) { return card.name === 'Remington'; }))
                range += 2;
            // if player has Rev. Carabine, increase range by 3
            if (this.players[playerName].table.some(function (card) { return card.name === 'Rev. Carabine'; }))
                range += 3;
            // if player has Winchester, increase range by 4
            if (this.players[playerName].table.some(function (card) { return card.name === 'Winchester'; }))
                range += 4;
            var playerIndex = playerNames.indexOf(playerName) + playerNames.length;
            var concatArray = playerNames.concat(playerNames.concat(playerNames)); // = [...arr, ...arr, ...arr]
            for (var i = 0; i < concatArray.length; i++) {
                var currentName = concatArray[i];
                if (currentName !== playerName && this.players[currentName].character.health > 0) {
                    var currentRange = range;
                    if (this.players[currentName].table.some(function (card) { return card.name === 'Mustang'; }))
                        currentRange -= 1;
                    if (this.players[currentName].character.name === "Paul Regret")
                        currentRange -= 1;
                    if (Math.abs(i - playerIndex) <= currentRange) {
                        result.push(currentName);
                    }
                }
                ;
            }
            return result;
        }
    };
    Game.prototype.getPlayerHand = function (playerName) {
        return (this.players[playerName].hand);
    };
    Game.prototype.getHands = function () {
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
        }
    };
    Game.prototype.getPlayerHasDynamite = function (playerName) {
        return (this.players[playerName].table.some(function (card) { return card.name === 'Dynamite'; }));
    };
    Game.prototype.getPlayerIsInPrison = function (playerName) {
        return (this.players[playerName].table.some(function (card) { return card.name === 'Prigione'; }));
    };
    Game.prototype.getTopStackCard = function () {
        return this.stack[this.stack.length - 1];
    };
    Game.prototype.getDeck = function () {
        return this.deck;
    };
    Game.prototype.getPlayers = function () {
        return this.players;
    };
    Game.prototype.getNameOfCurrentTurnPlayer = function () {
        // returns name of player who is on turn
        // const currentPlayer = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)
        var currentPlayer = this.playerNames[Math.floor(this.playerRoundId)];
        return currentPlayer;
    };
    Game.prototype.getNameOfPreviousTurnPlayer = function () {
        var _this = this;
        // returns name of player who was on turn before this turn
        var prevId = this.playerRoundId - 1;
        if (prevId < 0) {
            prevId = this.numOfPlayers;
        }
        return Object.keys(this.players).find(function (key) { return _this.players[key].id === prevId; });
    };
    Game.prototype.getAllPlayersChoseCharacter = function () {
        // returns true if all players have character
        // else return false
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            if (this.players[player].character.name === null) {
                return false;
            }
        }
        return true;
    };
    Game.prototype.getNameOfPlayersByRole = function (role) {
        // return array of playerNames who have specified role
        // except for bandits array length should be 1
        var names = [];
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            if (this.players[player].character.role === role) {
                names.push(player);
            }
        }
        return names;
    };
    // ******************* GAME FLOW *******************
    Game.prototype.putStackIntoDeck = function () {
        this.deck = this.stack;
        this.stack = [this.deck[this.deck.length - 1]];
        this.shuffleDeck();
    };
    Game.prototype.setIsLosingHealth = function (bool, player) {
        this.players[player].isLosingHealth = bool;
    };
    Game.prototype.startGame = function () {
        var _this = this;
        // each player draws startingHandSize cards
        this.shuffleDeck();
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            this.draw(this.players[player].character.startingHandSize, player);
        }
        var firstPlayerName;
        if (this.numOfPlayers >= 4) {
            firstPlayerName = Object.keys(this.players).find(function (player) { return _this.players[player].character.role === "Sheriff"; });
        }
        else {
            firstPlayerName = Object.keys(this.players).find(function (player) { return _this.players[player].id === 0; });
        }
        if (!firstPlayerName) {
            return;
        }
        if (this.players[firstPlayerName].character.name === "Lucky Duke") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (var i = 0; i < 2; i++) {
                var card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
        }
        else if (this.players[firstPlayerName].character.name === "Jesse Jones") {
            this.awaitDrawChoice = true;
        }
        else if (this.players[firstPlayerName].character.name === "Kit Carlson") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (var i = 0; i < 3; i++) {
                var card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
        }
        else {
            this.draw(2, firstPlayerName);
            this.setAllPlayable(firstPlayerName);
        }
        return ["Game started!"];
    };
    Game.prototype.shuffleDeck = function () {
        var _a;
        var currentIndex = this.deck.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            _a = [
                this.deck[randomIndex], this.deck[currentIndex]
            ], this.deck[currentIndex] = _a[0], this.deck[randomIndex] = _a[1];
        }
    };
    Game.prototype.endTurn = function () {
        //find who was previous player
        var message = [];
        var previousPlayerName = this.getNameOfCurrentTurnPlayer();
        if (this.players[previousPlayerName].character.name === "Suzy Lafayette" && this.players[previousPlayerName].hand.length === 0) {
            // Suzy Lafayette draws a card on turn end if hand empty
            message.push("Suzy Lafayette has hand empty, so she draws 1 card");
            this.draw(1, previousPlayerName);
        }
        // find next playerRoundId
        for (var i = 0; i < this.numOfPlayers; i++) {
            // move playerRoundId forward
            this.playerRoundId += 1;
            if (this.playerRoundId >= this.numOfPlayers) {
                this.playerRoundId = 0;
            }
            if (this.players[this.getNameOfCurrentTurnPlayer()].character.health > 0) {
                // if the next player is alive, continue and set his turn
                break;
            }
        }
        // this is next player in line
        var currentPlayerName = this.getNameOfCurrentTurnPlayer();
        this.bangCanBeUsed = true;
        message.push("End of turn, next player: ".concat(currentPlayerName));
        this.setAllNotPlayable(previousPlayerName);
        if (this.getPlayerHasDynamite(currentPlayerName) && this.getPlayerIsInPrison(currentPlayerName)) {
            this.setCardOnTablePlayable("Dynamite", currentPlayerName);
            this.players[currentPlayerName].isInPrison = true;
            this.setCardOnTablePlayable("Prigione", currentPlayerName);
            return message;
        }
        if (this.getPlayerHasDynamite(currentPlayerName)) {
            this.setCardOnTablePlayable("Dynamite", currentPlayerName);
            return message;
        }
        else if (this.getPlayerIsInPrison(currentPlayerName)) {
            this.players[currentPlayerName].isInPrison = true;
            this.setCardOnTablePlayable("Prigione", currentPlayerName);
            return message;
        }
        else if (this.players[currentPlayerName].character.name === "Jesse Jones") {
            this.awaitDrawChoice = true;
        }
        else if (this.players[currentPlayerName].character.name === "Pedro Ramirez" && this.stack.length > 0) {
            this.awaitDrawChoice = true;
        }
        else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (var i = 0; i < 3; i++) {
                var card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
        }
        else if (this.players[currentPlayerName].character.name === "Lucky Duke") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (var i = 0; i < 2; i++) {
                var card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
        }
        else {
            // proceed and draw
            if (this.players[currentPlayerName].character.name === "Black Jack" && (this.deck[1].type === "hearts" || this.deck[1].type === "diamonds")) {
                // Black Jack can draw 3 on hearts or diamonds
                message.push("".concat(currentPlayerName, " is Black Jack and drew ").concat(this.deck[1].name, " ").concat(this.deck[1].type, " as a second card so he draws another card"));
                this.draw(3, currentPlayerName);
            }
            else {
                message.push(this.draw(2, currentPlayerName));
            }
            this.setAllPlayable(currentPlayerName);
        }
        return message;
    };
    Game.prototype.removePlayer = function (playerName) {
        if (playerName === this.getNameOfCurrentTurnPlayer() && Object.keys(this.players).length > 1) {
            // if player turn and another player in game
            // next turn
            this.endTurn();
        }
        var numberOfBeersInHand = this.players[playerName].hand.filter(function (item) { return item.name === 'Beer'; }).length;
        this.players[playerName].character.health = 0 + numberOfBeersInHand;
        var message;
        for (var i = 0; i < numberOfBeersInHand + 1; i++) {
            message = this.loseHealth(playerName);
        }
        this.knownRoles[playerName] = this.players[playerName].character.role;
        return message;
    };
    Game.prototype.genCharacterChoices = function () {
        var res = {};
        var playerNames = Object.keys(this.players);
        for (var i = 0; i < this.numOfPlayers; i++) {
            var playerChoice = [];
            for (var i_1 = 0; i_1 < 2; i_1++) {
                var randIndex = Math.floor(Math.random() * this.namesOfCharacters.length);
                // add to player choice
                playerChoice.push(this.namesOfCharacters[randIndex]);
                // remove from namesOfCharacters
                this.namesOfCharacters.splice(randIndex, 1);
            }
            res[playerNames[i]] = playerChoice;
        }
        return res;
    };
    Game.prototype.initRoles = function () {
        // gives a role to each player
        // if roles is Sheriff, maxHP +1
        // if less than 4 players, leave roles as null
        if (this.numOfPlayers < 4)
            return;
        var roles;
        if (this.numOfPlayers === 4) {
            roles = ["Sheriff", "Renegade", "Bandit", "Bandit"];
        }
        else if (this.numOfPlayers === 5) {
            roles = ["Sheriff", "Renegade", "Bandit", "Bandit", "Vice"];
        }
        else if (this.numOfPlayers === 6) {
            roles = ["Sheriff", "Renegade", "Bandit", "Bandit", "Bandit", "Vice"];
        }
        if (!roles)
            return;
        // for (let player of Object.keys(this.players)) {
        for (var i = 0; i < Object.keys(this.players).length; i++) {
            var player = this.playerNames[i];
            // get random role, splice from roles
            var randIndex = Math.floor(Math.random() * roles.length);
            var role = roles.splice(randIndex, 1)[0];
            // add role to player
            this.players[player].character.role = role;
            // sherif +1 HP
            if (role === "Sheriff") {
                this.players[player].character.maxHealth += 1;
                this.players[player].character.health += 1;
                this.players[player].character.startingHandSize += 1;
                this.knownRoles[player] = role;
                this.playerRoundId = i;
            }
            else {
                this.knownRoles[player] = null;
            }
        }
    };
    Game.prototype.endGame = function () {
        this.gameEnded = true;
        for (var _i = 0, _a = Object.keys(this.players); _i < _a.length; _i++) {
            var player = _a[_i];
            // turns off all playable cards
            this.setAllNotPlayable(player);
            for (var _b = 0, _c = this.players[player].table; _b < _c.length; _b++) {
                var card = _c[_b];
                this.setCardOnTableNotPlayable(card, player);
            }
            // uncover known roles
            this.knownRoles[player] = this.players[player].character.role;
        }
    };
    return Game;
}());
exports.Game = Game;
