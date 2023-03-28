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
        name: "Vulcanic",
        rimColor: "blue",
        digit: 2,
        type: "spades",
        class: "gun",
        isPlayable: false,

    },
    {
        name: "Emporio",
        rimColor: "yellow",
        digit: 3,
        type: "diamonds",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 4,
        type: "spades",
        isPlayable: false
    },
]

const P2_D1 = [
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "diamonds",
        isPlayable: false
    },
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 6,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 7,
        type: "diamonds",
        isPlayable: false
    },
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "spades",
        isPlayable: false
    },
]

const P1_D2 = [
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 9,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 10,
        type: "clubs",
        isPlayable: false
    },
]

const P2_D2 = [
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 11,
        type: "spades",
        isPlayable: false
    },
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 12,
        type: "clubs",
        isPlayable: false
    },
]


export const testEmporioDeck = [...P1_D1, ...P2_D1, ...P1_D2, ...P2_D2,
...P1_D1, ...P2_D1, ...P1_D2, ...P2_D2]
