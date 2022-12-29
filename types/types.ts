export interface Card {
    name: string;
    rimColor: string;
    digit: number;
    type: string;
    isPlayable: boolean;
    class?: "horse" | "dynamite" | "gun" | "prison" | "barel";
}

export interface RoomInfo {
    name: string;
    numOfPlayers: number;
    gameActive: boolean;
}

export interface Characters {
    playerName: string;
    character: string;
}