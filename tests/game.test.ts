import {describe, expect, test} from '@jest/globals';
import { Game } from '../game';
import { deck } from '../deck';

describe('drawing', () => {
  test('draw 2 cards on game start', () => {
    const testDeck = [...deck];

    const game = new Game(["Sbeve", "Joe"], testDeck);
    game.setCharacter("Sbeve", "Calamity Janet");
    game.setCharacter("Joe", "Calamity Janet");
    // game.players["Sbeve"].character.health = 1;
    // game.players["Joe"].character.health = 1;
    
    game.initRoles();
    game.startGame();
    expect(game.players["Sbeve"].hand.length).toBe(6);
        
    game.endTurn();
    expect(game.players["Joe"].hand.length).toBe(4);
  });
});