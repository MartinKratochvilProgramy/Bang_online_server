const P1_D1 = [
    {
        name: "Prigione",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "barel",
        isPlayable: false,

    },
    {
        name: "Prigione",
        rimColor: "blue",
        digit: 2,
        type: "hearts",
        class: "barel",
        isPlayable: false,

    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 3,
        type: "spades",
        class: "dynamite",
        isPlayable: false,

    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 4,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,

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
        name: "Dynamite",
        rimColor: "blue",
        digit: 6,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,

    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 7,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,

    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 8,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,

    },
]

const P1_D2 = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 9,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,

    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,

    },
]

const prison_D1 = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,

    }
]
const prison_D2 = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 11,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,
    }
]

const restOfTheDeck = [
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 6,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 13,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 14,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 15,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 16,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 17,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 18,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 19,
        type: "spades",
        class: "dynamite",
        isPlayable: false,
    },
]



export const testPrigioneDeck = [...P1_D1, ...P2_D1, ...P1_D2, ...prison_D1, ...prison_D2, ...P1_D1,
...restOfTheDeck, ...restOfTheDeck]
