import { Card } from "../types/types"

export function compareHands(arr1: Card[], arr2: Card[]): boolean {
    if (arr1.length !== arr2.length) return false

    for (let i = 0; i < arr1.length; i++) {
        const card1 = arr1[i];
        const card2 = arr2[i];

        if (card1.name !== card2.name ||
            card1.digit !== card2.digit ||
            card1.type !== card2.type ||
            card1.isPlayable !== card2.isPlayable
        ) {
            return false
        }
    }
    return true
}