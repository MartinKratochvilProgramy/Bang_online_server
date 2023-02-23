import { Card } from "../types/types"
import { compareCards } from "./compareCards";

export function compareHands(arr1: Card[], arr2: Card[]): boolean {
    if (arr1.length !== arr2.length) return false

    for (let i = 0; i < arr1.length; i++) {
        const card1 = arr1[i];
        const card2 = arr2[i];

        compareCards(card1, card2)
    }
    return true
}