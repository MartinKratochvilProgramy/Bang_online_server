const P1_D1 = [
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "barel",
        isPlayable: false,

    },
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 2,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 3,
        type: "diamonds",
        isPlayable: false
    },
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 4,
        type: "spades",
        isPlayable: false
    },
]

const P2_D1 = [
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 5,
        type: "hearts",
        class: "barel",
        isPlayable: false,

    },
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 6,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 7,
        type: "diamonds",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 8,
        type: "spades",
        isPlayable: false
    },
]

const P1_D2 = [
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 9,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 10,
        type: "clubs",
        isPlayable: false
    },
]

const P2_D2 = [
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 11,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 12,
        type: "hearts",
        class: "barel",
        isPlayable: false,

    },
]


export const testPanicoDeck = [...P1_D1, ...P2_D1, ...P1_D2, ...P2_D2,
...P1_D1, ...P2_D1, ...P1_D2, ...P2_D2]
