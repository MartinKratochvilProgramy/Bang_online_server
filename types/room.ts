import { Game } from '../game'
import { Player } from './player'

export type Rooms = {
    [roomName: string]: Room;
  };

interface Room {
    players: Player[],
    messages: string[],
    game: Game | null
}