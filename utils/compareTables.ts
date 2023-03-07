import { Card } from "../types/types"
import { compareCards } from "./compareCards";

export function compareTables(table1: Card[], table2: Card[]): boolean {
    if (table1.length !== table2.length) return false

    for (let i = 0; i < table1.length; i++) {
        const card1 = table1[i];
        const card2 = table2[i];

        if (!compareCards(card1, card2)) return false
    }
    return true
}