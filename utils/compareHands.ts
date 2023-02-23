import { Card } from "../types/types"
import { compareCards } from "./compareCards";

export function compareHands(hand1: Card[], hand2: Card[]): boolean {
    if (hand1.length !== hand2.length) return false

    for (let i = 0; i < hand1.length; i++) {
        const card1 = hand1[i];
        const card2 = hand2[i];

        if (!compareCards(card1, card2)) return false
    }
    return true
}