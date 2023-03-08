import { Game } from '../game'
import { Player } from './player'

export type Rooms = {
    [roomName: string]: Room;
  };

interface Room {
    players: Player[],
    messages: Message[],
    game: Game | null
}

interface Message {
  username: string,
  message: string
}