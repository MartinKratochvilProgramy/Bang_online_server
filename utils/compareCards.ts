import { Card } from "../types/types"

export function compareCards(car1: Card, card2: Card): boolean {
    if (car1 === undefined || card2 === undefined) return false

    if (
        car1.name === card2.name &&
        car1.digit === card2.digit &&
        car1.type === card2.type &&
        car1.isPlayable === card2.isPlayable
    ) {
        return true
    } else {
        return false
    }
}