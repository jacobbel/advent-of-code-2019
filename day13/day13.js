const fs = require("fs");
const IntMachine = require("../IntMachine");
const assert = require("assert");

const input = fs.readFileSync(__dirname + "/input", "utf8").split(",").map(x => +x);

const EMPTY = 0;
const WALL = 1;
const BLOCK = 2;
const PADDLE = 3;
const BALL = 4;
const NEUTRAL = 0;
const RIGHT = 1;
const LEFT = -1;

let map = {};


let arcade = new IntMachine(input.slice());

arcade.run();

assert(arcade.outputQueue.length % 3 === 0);

let grid = arcade.outputQueue;
let blockCount = 0;

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;


while (grid.length !== 0) {
    const x = grid.shift();
    const y = grid.shift();
    const tile = grid.shift()
    if (tile === BLOCK) {
        blockCount += 1;
    }
    map[[x, y].toString()] = tile;
    if (x < minX) {
        minX = x;
    }
    if (x > maxX) {
        maxX = x;
    }
    if (y < minY) {
        minY = y;
    }
    if (y > maxY) {
        maxY = y;
    }
}

const W = maxX + 1 - minX;
const H = maxY + 1 - minY;

function toIndex(xy, W) {
    const idx = xy[0] + (W * xy[1]);
    return idx;
}

const reset = "\x1b[0m"
const black = "\x1b[40m"
const white = "\x1b[47m"
const grey = "\x1b[100m";
const red = "\x1b[41m";
const blue = "\x1b[44m"

function toPixel(val) {
    if (val === EMPTY) {
        return black + " " + reset;
    } else if (val === WALL) {
        return grey + " " + reset;
    } else if (val === BALL) {
        return white + " " + reset;
    } else if (val === BLOCK) {
        return red + " " + reset;
    } else if (val === PADDLE) {
        return blue + " " + reset;
    }
}

function printImage(image, W) {
    let ret = "";
    for (let i = 0; i < image.length; i++) {
        if (i % W === 0 && i != 0) {
            ret += '\n';
        }
        ret += image[i];
    }

    console.log(ret);
}

function printMap(map, W, H) {
    let image = [];
    image.length = W * H;
    image.fill(toPixel(0));

    for (key in map) {
        let xy = key.split(",").map(x => +x);
        const i = toIndex(xy, W);
        const pixel = toPixel(map[key]);
        image[i] = pixel;
    }

    printImage(image, W);
}

printMap(map, W, H);



console.log(`There are ${blockCount} tiles in the game`);

const prog = input.slice();
prog[0] = 2;
arcade = new IntMachine(prog);

let score = 0;

map = {};

process.stdout.write('\033c');

function getInput(ball, player) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (player[0] < ball[0]) {
                resolve(RIGHT);
            } else if (player[0] > ball[0]) {
                resolve(LEFT);
            } else {
                resolve(NEUTRAL);
            }
        }, 5);
    });
}

async function run(arcade) {
    grid = arcade.outputQueue;
    let ball, player;
    while (arcade.state !== "stopped") {
        arcade.run();
        while (grid.length !== 0) {
            const x = grid.shift();
            const y = grid.shift();
            const tile = grid.shift()
            if (tile === BALL) {
                ball = [x, y];
            } else if (tile === PADDLE) {
                player = [x, y];
            }
            if (x === -1 && y === 0) {
                score = tile;
            } else {
                map[[x, y].toString()] = tile
            }
        }
        process.stdout.write('\033c');
        printMap(map, W, H);
        console.log("Score is:", score);
        const input = await getInput(ball, player);
        arcade.queueInput(input);
    }
}

run(arcade);