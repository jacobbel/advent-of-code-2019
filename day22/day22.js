const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input", "utf8").split("\n");

/**
 * 
 * @param {Array} deck 
 */
function newStack(deck) {
    return deck.reverse();
}

/**
 * 
 * @param {Array} deck 
 * @param {number} n 
 */
function cut(deck, n) {
    const remainder = deck.splice(n);
    return remainder.concat(deck);
}

/**
 * 
 * @param {Array} deck 
 * @param {number} n 
 */
function incrementN(deck, n) {
    const newDeck = new Array(deck.length);
    for (let i = 0, j = 0; j < deck.length; i += n, ++j) {
        newDeck[i % deck.length] = deck[j];
    }
    return newDeck;
}

function shuffle(deck, sequence) {
    for (let tech of sequence) {
        tech = tech.split(" ");
        const key = tech[tech.length - 2];
        const param = +tech[tech.length - 1];

        switch (key) {
            case "new":
                {
                    deck = newStack(deck);
                    break;
                }
            case "cut":
                {
                    deck = cut(deck, param);
                    break;
                }
            case "increment":
                {
                    deck = incrementN(deck, param);
                    break;
                }
        }
    }
    return deck;
}

let deck = [...Array(10007).keys()];

deck = shuffle(deck, input);

const ans = deck.findIndex((val) => val === 2019);

console.log("Part 1:", ans);

function mod(n, m) {
    n = BigInt(n);
    m = BigInt(m);
    return ((n % m) + m) % m;
}

function expmod(a, b, n) {
    a = a % n;
    var result = 1n;
    var x = a;
    while (b > 0) {
        var leastSignificantBit = b % 2n;
        b = b / 2n;
        if (leastSignificantBit == 1n) {
            result = result * x;
            result = result % n;
        }
        x = x * x;
        x = x % n;
    }
    return result;
};

function f(i, start, step, size) {
    return mod((step * i + start), size);
}

function applyOps(sequence, start, step, size) {
    start = BigInt(start);
    step = BigInt(step);
    size = BigInt(size);
    for (let tech of sequence) {
        tech = tech.split(" ");
        const key = tech[tech.length - 2];
        let param = +tech[tech.length - 1];
        switch (key) {
            case "new":
                {
                    start = mod((start - step), size);
                    step = mod(-step, size);
                    break;
                }
            case "cut":
                {
                    param = BigInt(param);
                    if (param < 0) param += size
                    start = mod((start + step * param), size);
                    break;
                }
            case "increment":
                {
                    param = BigInt(param);
                    step = mod((step * expmod(param, size - 2n, size)), size);
                    break;
                }
        }
    }
    return [start, step];
}

function repeat(start, step, size, repetitions) {
    finalStep = expmod(step, repetitions, size);
    const S = (1n - finalStep) * expmod(1n - step, size - 2n, size);
    finalStart = mod(start * S, size);
    return [finalStart, finalStep];
}

const times = 101741582076661n;
let size = 119315717514047n;
let start = 0n;
let step = 1n;

[start, step] = applyOps(input, start, step, size);
[start, step] = repeat(start, step, size, times);


const ans2 = f(2020n, start, step, size);

console.log("Part 2:", Number(ans2));